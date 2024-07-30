import { 
    createExternalMediaChannelWithBreaker, 
    createBridgeWithBreaker,
    addChannelToBridgeWithBreaker,
    getOutgoingCallInformationWithBreaker,
    getRtpInfoFormVbProxyWithBreaker,
    postRtpInfoToVbProxyWithBreaker,
    postEventToVbProxyWithBreaker 
} from '../services/circuit-breaker-operations.js';

import { 
    getcallIdFromChannelId,
    setValueChannelIdWithKeyCallId,
    deleteCallIdFromMap
 } from '../utils/helper.js';

import logger from '../utils/logger.js';

let processChannel = new Set();


export async function handleStasisStartEvent(event, channel){
    let rtpReceiverIP = '';
    let rtpReceiverPort = '';

    const incomingChannelId = channel.id;
    logger.info(`Channel ${incomingChannelId} entered Stasis application for event: ${event.type} and channel state: ${event.channel.state}`);
    console.log(`processChannel-set value:`);
    console.log(processChannel);

    if (processChannel.has(incomingChannelId)) {
      logger.info(`Channel ${incomingChannelId} already processed`);
      processChannel.delete(incomingChannelId);
      return;
    }
    //keep a map between channelID and random call id //todo
    const callId = Math.floor(Math.random() * 100000).toString();
    processChannel.add(callId);

    try{
        const rtpResponse = await getRtpInfoFormVbProxyWithBreaker.fire(callId);
        if(rtpResponse.status == '200'){
            if(rtpResponse.data.status_code == '200'){
                rtpReceiverIP = rtpResponse.data.host;
                rtpReceiverPort = parseInt(rtpResponse.data.port, 10);
            } else {
                logger.error(`Failed to fetch rtp host and ip from vb-proxy for callId: ${callId}!!!, wrong status code: ${rtpResponse.data.status_code} !!!`);
                return;
            }

        } else {
            logger.error(`Failed to fetch rtp host and ip from vb-proxy for callId: ${callId}!!!`);
            return;
        }

        const external_media_data = await createExternalMediaChannelWithBreaker.fire(callId, rtpReceiverIP, rtpReceiverPort);
        const channelVars = external_media_data.channelvars;
    
    
        if(channelVars){
            //set a map between callID and incomming channel ID
            await setValueChannelIdWithKeyCallId(callId, incomingChannelId);
            const localAddress = channelVars.UNICASTRTP_LOCAL_ADDRESS;
            const localPort = channelVars.UNICASTRTP_LOCAL_PORT;
            const bridgeId = Math.floor(Math.random() * 100000);
    
            await createBridgeWithBreaker.fire(bridgeId);
            logger.debug(`successfully created bridge with bridgeId: ${bridgeId}`);
    
            await addChannelToBridgeWithBreaker.fire(bridgeId, external_media_data.id);
            logger.debug(`successfully added channel: ${external_media_data.id} to bridgeId: ${bridgeId}`);
    
            const response = await getOutgoingCallInformationWithBreaker.fire();
            const ongoingCall = response.data.find(c => c.name.includes('PJSIP/'));
            if (ongoingCall) {
              logger.debug(`Ongoing Call ID: ${ongoingCall.id} and Name: ${ongoingCall.name}`);
              await addChannelToBridgeWithBreaker.fire(bridgeId, ongoingCall.id);
            } else {
              logger.info("No ongoing calls");
            }
            //send udp port to vb proxy
            await postRtpInfoToVbProxyWithBreaker.fire(callId, localAddress, localPort);

        } else {
            logger.error(`Channel variables are empty.`);
        }
    }catch(error){
       logger.error(`Error processing StasisStart event: ${error}`);
    }

}

export async function handleChannelStateChangeEvent(event){
    logger.info(`Channel state changed: ${event.channel.id}, State: ${event.channel.state}`);
    return;
}

export async function handleChannelHangupRequestEvent(event){
    logger.debug(`Channel hangup requested: ${event.channel.id}`);
    const callId = await getcallIdFromChannelId(event.channel.id);
    await deleteCallIdFromMap(callId);
    //callStateMap.delete(endCallId);
    await postEventToVbProxyWithBreaker.fire(callId, "CALL_TERMINATION");
    return;
}

export async function handleChannelDtmfReceivedEvent(event){
   logger.info(`DTMF received on channel: ${event.channel.id}, Digit: ${event.digit}`);
    return;
}
