import express from 'express';
import bodyParser from 'body-parser';

import { config } from '../config/config.js';
import { processIncommingEventFromVB } from '../handler/webhook-events.js';
import logger from '../utils/logger.js';

const app = express();
app.use(bodyParser.json());

app.post('/ari-proxy/event', async(req, resp)=>{
    const event = req.body;
    let event_in_string = JSON.stringify(event);
    logger.debug(`Event Received from VB-proxy: ${event_in_string}`);
    let response = '';
    
    try{
        await processIncommingEventFromVB(event);
        resp.status(200).send('Event received and processed');
    }catch(error){
        logger.error(`Error processing event: ${error}`);
        resp.status(500).send('Internal Server Error');
    }
});

export function startServer(){
    const port = config.webhook.port;
    app.listen(port, ()=>{
        logger.info(`Webhook server is running on port ${port}`);
    });
}