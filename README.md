# NestJS TypeScript Microservice

A small production-friendly NestJS microservice starter using TCP transport.

## Features

- NestJS microservice mode
- TCP transport by default
- Request-response pattern with `@MessagePattern()`
- Event pattern with `@EventPattern()`
- Global validation pipe
- Central RPC exception filter
- Typed environment validation
- Example client
- Jest unit test
- Dockerfile

## Requirements

- Node.js 22+
- npm

## Setup

```bash
npm install
cp .env.example .env
```

## Run microservice

```bash
npm run start:dev
```

Default address:

```txt
tcp://127.0.0.1:4001
```

## Test with the example client

In another terminal:

```bash
npm run client
```

The client sends:

- `{ cmd: 'health' }`
- `{ cmd: 'sum' }` with `{ numbers: [1, 2, 3, 4, 5] }`
- `user.created` event

## Build

```bash
npm run build
npm start
```

## Test

```bash
npm test
npm run typecheck
npm run check
```

## Environment variables

```env
NODE_ENV=development
SERVICE_NAME=math-service
MICROSERVICE_HOST=127.0.0.1
MICROSERVICE_PORT=4001
```

Do not commit real secrets. Use your deployment platform's secret manager for production credentials.

## Message patterns

### Health

```ts
client.send({ cmd: 'health' }, {})
```

### Sum

```ts
client.send({ cmd: 'sum' }, { numbers: [1, 2, 3] })
```

### User created event

```ts
client.emit('user.created', {
  id: 'user_123',
  email: 'user@example.com'
})
```

## Switch transport later

This boilerplate uses TCP because it needs no external broker. For production systems, you can replace the transport in `src/main.ts` and `src/client.ts` with Redis, RabbitMQ, Kafka, NATS, MQTT, or gRPC depending on your architecture.
