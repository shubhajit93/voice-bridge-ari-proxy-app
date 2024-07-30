# Voice Bridge Stasis App
## Overview
This project is an Asterisk Rest Interface (ARI) application that manages external media channels and bridges using circuit breakers for fault tolerance. The application is modular, with separated configuration, utility functions, ARI operations, and event handlers.

## Prerequisites

- Node.js v20.11.0 or later
- npm (Node Package Manager)
- An Asterisk instance with ARI enabled

## Installation

#### 1. Clone the repository
```commandline
git clone https://bitbucket.org/hishabdevs/voice-bridge-ari-app.git
```
#### 2. Go to project directory
```commandline
cd voice-bridge-ari-app
```
#### 3. Install dependencies
```commandline
npm install
```

### Configuration

Create a `.env` file in the root directory of the project and add the following environment variables:

```dotenv
VOICE_BRIDGE_PROXY_BASE_URL=http://127.0.0.1:3002/stream
ARI_URL=http://192.168.56.44:8088
ARI_USERNAME=asterisk
ARI_PASSWORD=asterisk
ARI_APP_NAME=stt
AXIOS_TIMEOUT=10000
CIRCUIT_BREAKER_TIMEOUT=5000
CIRCUIT_BREAKER_ERROR_THRESHOLD=50
CIRCUIT_BREAKER_RESET_TIMEOUT=30000
```

## Description
- VOICE_BRIDGE_PROXY_BASE_URL: Base URL for the voice bridge proxy stream.
- ARI_URL: URL for the Asterisk ARI interface.
- ARI_USERNAME: Username for ARI authentication.
- ARI_PASSWORD: Password for ARI authentication.
- ARI_APP_NAME: Name of the ARI application.
- AXIOS_TIMEOUT: Timeout for Axios HTTP requests (in milliseconds).
- CIRCUIT_BREAKER_TIMEOUT: Timeout for the circuit breaker (in milliseconds).
- CIRCUIT_BREAKER_ERROR_THRESHOLD: Error threshold percentage for the circuit breaker.
- CIRCUIT_BREAKER_RESET_TIMEOUT: Reset timeout for the circuit breaker (in milliseconds).

## Start Application
```commandline
npm start
```

## Start Application Using Docker
```commandline
docker-compose up --build -d
```

## Curl Command
#### 1. End call event from vb-proxy to ari-proxy
```commandline
curl --location 'http://127.0.0.1:4001/ari-proxy/event' \
--header 'Content-Type: application/json' \
--data '{
    "type": "END_CALL",
    "callId": "41489",
    "timestamp": "2024-07-09T12:34:56Z"
}'
```

#### 2. End call event from ari-proxy to vb-proxy
```commandline
curl --location 'http://localhost:3002/stream/optclose/' \
--header 'Content-Type: application/json' \
--data '{
   "callId":"35969"
}'
```