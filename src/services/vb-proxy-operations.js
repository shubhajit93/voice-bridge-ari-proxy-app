import axios from 'axios';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';

export async function getRtpInfoFormVbProxy(callID){
    const url = `${config.baseUrl}/optin/${callID}`;
    logger.debug(`getting rtp user/port url: ${url}`);
    const response = await axios.get(url);
    return response;
}

export async function postRtpInfoToVbProxy(callID, host, port){
    
    const url = `${config.baseUrl}/optout/`;
    const data = {
        callId:callID,
        host:host,
        port:port
    };
    let log_data_string = JSON.stringify(data);
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, data, {
        headers:headers
    })
    .then(response => {
        logger.debug(`post upd data to vb proxy: ${log_data_string}`);
        //logger.debug(response.data);
    })
    .catch(error => {
        logger.error(`error posting data to vb proxy: ${error}`);
    });
}

export async function postEventToVbProxy(callID, eventType){
    const url = `${config.baseUrl}/optclose/`;
    const data = {
        callId:callID
    };
    const headers = {
        'Content-Type': 'application/json'
    }
    axios.post(url, data, {
        headers:headers
    })
    .then(response => {
        logger.debug(`post ${eventType} event data to vb proxy`);
        //logger.debug(response.data);
    })
    .catch(error => {
        logger.error(`error posting ${eventType} event data to vb proxy: ${error}`);
    });
}