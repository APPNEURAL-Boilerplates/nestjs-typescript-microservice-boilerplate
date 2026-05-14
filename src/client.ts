import 'dotenv/config';
import 'reflect-metadata';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { validateEnv } from './config/env.validation';

async function runClient(): Promise<void> {
  const env = validateEnv(process.env);

  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: env.MICROSERVICE_HOST,
      port: env.MICROSERVICE_PORT
    }
  });

  await client.connect();

  const health = await firstValueFrom(client.send({ cmd: 'health' }, {}));
  console.log('health:', health);

  const sum = await firstValueFrom(client.send({ cmd: 'sum' }, { numbers: [1, 2, 3, 4, 5] }));
  console.log('sum:', sum);

  await firstValueFrom(
    client.emit('user.created', {
      id: 'user_123',
      email: 'user@example.com'
    })
  );

  client.close();
}

void runClient();
