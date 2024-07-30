import { callStateMap } from "./global-state.js";

export async function getcallIdFromChannelId(value) {
    for (const [key, val] of callStateMap.entries()) {
        if (val === value) {
            return key;
        }
    }
    return undefined;
}

export async function getChannelIdFromCallId(value){
    if(callStateMap.has(value)){
        return callStateMap.get(value);
    }
    return undefined;
}

export async function deleteCallIdFromMap(value){
    callStateMap.delete(value);
}

export async function setValueChannelIdWithKeyCallId(key, value){
    callStateMap.set(key, value);
}