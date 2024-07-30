import { hangupChannelWithBreaker } from "../services/circuit-breaker-operations.js";
import { 
    getChannelIdFromCallId,
    deleteCallIdFromMap
 } from "../utils/helper.js";
 import logger from "../utils/logger.js";

export async function processIncommingEventFromVB(event){
    logger.info(`Event type received: ${event.type} with callId: ${event.callId}`);

    let channelId = await getChannelIdFromCallId(event.callId);
    
    if(channelId){  
        switch(event.type){
            case 'END_CALL':
                await hangupChannelWithBreaker.fire(channelId);
                await deleteCallIdFromMap(event.callId);
                break;
            //handle other events
            default:
                logger.error(`Unhandled event type: ${event.type}`);
        }
    } else{
        logger.error(`Event type: ${event.type} with CallId: ${event.callId} is not found!!!`);
    }
    


}