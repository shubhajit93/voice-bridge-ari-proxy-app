import dotenv from 'dotenv'

dotenv.config();

export const config = {
    baseUrl:process.env.VOICE_BRIDGE_PROXY_BASE_URL,
    axiosTimeout:parseInt(process.env.AXIOS_TIMEOUT, 10),
    ari_info:{
        ariUrl:process.env.ARI_URL,
        userName:process.env.ARI_USERNAME,
        password:process.env.ARI_PASSWORD,
        appName:process.env.ARI_APP_NAME
    },
    webhook:{
        port:process.env.WEBHOOK_PORT || 4001
    },
    circuitBreaker_option:{
        timeout:parseInt(process.env.CIRCUIT_BREAKER_TIMEOUT, 10),
        errorThresholdPercentage:parseInt(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD, 10),
        resetTimeout:parseInt(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT, 10)
    },
    logger:{
        logLevel:process.env.LOG_LEVEL
    },
    outbound_call:{
        extension:process.env.OUTBOUND_CALL_EXTENSION,
        context:process.env.OUTBOUND_CALL_CONTEXT,
        priority:parseInt(process.env.OUTBOUND_CALL_PRIORITY),
        ring_timeout:parseInt(process.env.OUTBOUND_CALL_RING_TIMEOUT),
        app_argument:process.env.OUTBOUND_CALL_APP_ARGUMENT
    }
};
