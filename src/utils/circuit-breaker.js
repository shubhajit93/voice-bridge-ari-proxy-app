import CircuitBreaker  from 'opossum';
import { config } from '../config/config.js';

function applyCircuitBreaker(func){
    const breaker = new CircuitBreaker (func, config.circuitBreaker_option);
    breaker.fallback(() => ({ error: `Fallback response for ${func.name}` }));
    return breaker;
}

export default applyCircuitBreaker;