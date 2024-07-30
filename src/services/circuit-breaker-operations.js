import applyCircuitBreaker from "../utils/circuit-breaker.js";

import { 
    getRtpInfoFormVbProxy, 
    postRtpInfoToVbProxy ,
    postEventToVbProxy
} from "./vb-proxy-operations.js";

import { 
    createExternalMediaChannel,
    createBridge, 
    addChannelToBridge, 
    getOutgoingCallInformation ,
    hangupChannel
} from "./ari-operations.js";

export const createExternalMediaChannelWithBreaker = applyCircuitBreaker(createExternalMediaChannel);
export const createBridgeWithBreaker = applyCircuitBreaker(createBridge);
export const addChannelToBridgeWithBreaker = applyCircuitBreaker(addChannelToBridge);
export const getOutgoingCallInformationWithBreaker = applyCircuitBreaker(getOutgoingCallInformation);
export const hangupChannelWithBreaker = applyCircuitBreaker(hangupChannel);


export const getRtpInfoFormVbProxyWithBreaker = applyCircuitBreaker(getRtpInfoFormVbProxy);
export const postRtpInfoToVbProxyWithBreaker = applyCircuitBreaker(postRtpInfoToVbProxy);
export const postEventToVbProxyWithBreaker = applyCircuitBreaker(postEventToVbProxy);
