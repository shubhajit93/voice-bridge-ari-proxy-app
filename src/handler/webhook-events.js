import { 
    hangupChannelWithBreaker,
    originateOutboundCallWithBreaker 
} from "../services/circuit-breaker-operations.js";
import { 
    getChannelIdFromCallId,
    deleteCallIdFromMap
 } from "../utils/helper.js";
 import logger from "../utils/logger.js";

export async function processIncommingEventFromVB(event){
    logger.info(`Event type received: ${event.type} with callId: ${event.callId}`);

    switch(event.type){
        case 'END_CALL':
            let channelId = await getChannelIdFromCallId(event.callId);
            await hangupChannelWithBreaker.fire(channelId);
            await deleteCallIdFromMap(event.callId);
            break;
        case 'OUTBOUND_CALL':
            //callId ignorable, because callId is generated inside ari application and then sent to vp proxy
            logger.info(`Request for outbound call with destination: ${event.data.destination} amd source: ${event.data.source}`);
            const result = await originateOutboundCallWithBreaker.fire(event.data.destination, event.data.source);
            return result;

        default:
            logger.error(`Unhandled Event type: ${event.type} with CallId: ${event.callId}`);
    }

}