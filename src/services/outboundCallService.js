import axios from 'axios';
import { config } from "../config/config.js";
import logger from "../utils/logger.js";

export async function originateOutboundCall(destination, source){
    try{
        const url = `${config.ari_info.ariUrl}/ari/channels`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`${config.ari_info.userName}:${config.ari_info.password}`).toString('base64')}`
        };
        const callDetails = {
            endpoint: `PJSIP/mytrunk/${destination}`,
            extension: config.outbound_call.extension,
            context: config.outbound_call.context,
            priority: config.outbound_call.priority,
            callerId: source,
            timeout: config.outbound_call.ring_timeout,
            app: config.ari_info.appName,
            appArgs: config.outbound_call.app_argument
          };

        const response = await axios.post(url, callDetails, { headers });
        const log_response = JSON.stringify(response.data);
        logger.info(`Successfully originated outbound call with data: ${log_response}`);
        return response.data;

    }
    catch(error){
        logger.error(`Failed to generate outbout call for callerID:${callData.callerId}, error:${error}`);
        throw error;
    }
}