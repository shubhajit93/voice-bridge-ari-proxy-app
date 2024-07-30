import ari from 'ari-client';
import { config } from './config/config.js';
import { startServer } from './server/webhook-server.js';
import { 
    handleStasisStartEvent, 
    handleChannelStateChangeEvent,
    handleChannelHangupRequestEvent,
    handleChannelDtmfReceivedEvent 
} from './handler/ari-events.js';
import logger from './utils/logger.js';

async function connectToAri(){
    try{
        const client = await ari.connect(config.ari_info.ariUrl, config.ari_info.userName, config.ari_info.password);
        client.on('StasisStart', handleStasisStartEvent);
        client.on('ChannelStateChange', handleChannelStateChangeEvent);
        client.on('ChannelHangupRequest', handleChannelHangupRequestEvent);
        client.on('ChannelDtmfReceived', handleChannelDtmfReceivedEvent);

        client.start(config.ari_info.appName);
        logger.info(`Connected to ARI and started application`);

    }catch(error){
        logger.error(`error connecting to ari application: ${error}`);
    }
}

connectToAri();
startServer();