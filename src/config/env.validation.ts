export type NodeEnv = 'development' | 'test' | 'production';

export interface AppEnv {
  NODE_ENV: NodeEnv;
  SERVICE_NAME: string;
  MICROSERVICE_HOST: string;
  MICROSERVICE_PORT: number;
}

const allowedNodeEnvs: NodeEnv[] = ['development', 'test', 'production'];

function parsePort(value: unknown, fallback: number): number {
  const raw = value ?? fallback;
  const port = Number(raw);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('MICROSERVICE_PORT must be an integer between 1 and 65535');
  }

  return port;
}

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const nodeEnv = String(config.NODE_ENV ?? 'development') as NodeEnv;

  if (!allowedNodeEnvs.includes(nodeEnv)) {
    throw new Error(`NODE_ENV must be one of: ${allowedNodeEnvs.join(', ')}`);
  }

  return {
    NODE_ENV: nodeEnv,
    SERVICE_NAME: String(config.SERVICE_NAME ?? 'math-service'),
    MICROSERVICE_HOST: String(config.MICROSERVICE_HOST ?? '127.0.0.1'),
    MICROSERVICE_PORT: parsePort(config.MICROSERVICE_PORT, 4001)
  };
}
