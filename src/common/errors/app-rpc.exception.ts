import { RpcException } from '@nestjs/microservices';

export class AppRpcException extends RpcException {
  constructor(code: string, message: string, details?: unknown) {
    super({
      code,
      message,
      details
    });
  }
}
