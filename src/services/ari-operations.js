import axios from 'axios';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';

export async function createExternalMediaChannel(generatedChannelId, rtpReceiverIP, rtpReceiverPort){
    const url = `${config.ari_info.ariUrl}/ari/channels/externalMedia?channelId=${generatedChannelId}&app=${config.ari_info.appName}&external_host=${rtpReceiverIP}%3A${rtpReceiverPort}&encapsulation=rtp&format=ulaw&transport=udp&connection_type=server&api_key=${config.ari_info.userName}:${config.ari_info.password}`;
    logger.debug(`External media url: ${url}`);
    const response = await axios.post(url);
    return response.data;
}

export async function createBridge(bridgeId){
    const url = `${config.ari_info.ariUrl}/ari/bridges/${bridgeId}?type=mixing&api_key=${config.ari_info.userName}:${config.ari_info.password}`;
    logger.debug(`Bridge url: ${url}`);
    const response = await axios.post(url);
}

export async function addChannelToBridge(bridgeId, channelId){
    const url = `${config.ari_info.ariUrl}/ari/bridges/${bridgeId}/addChannel?channel=${channelId}&api_key=${config.ari_info.userName}:${config.ari_info.password}`;
    logger.debug(`Add channel url:${url}`);
    const response = await axios.post(url);
}

export async function getOutgoingCallInformation(){
    const url = `${config.ari_info.ariUrl}/ari/channels?api_key=${config.ari_info.userName}:${config.ari_info.password}`;
    logger.debug(`outgoing call url:${url}`);
    const response = await axios.get(url);
    return response;
}

export async function hangupChannel(channelId){
    const url = `${config.ari_info.ariUrl}/ari/channels/${channelId}?api_key=${config.ari_info.userName}:${config.ari_info.password}`;
    logger.debug(`Delete channel request: ${url}`);
    const response = await axios.delete(url);
    return response;
}