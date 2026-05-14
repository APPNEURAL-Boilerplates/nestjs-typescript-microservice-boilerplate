import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

type RpcErrorBody = {
  code: string;
  message: string | string[];
  details?: unknown;
  timestamp: string;
};

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcExceptionFilter.name);

  catch(exception: unknown, _host: ArgumentsHost): Observable<never> {
    const error = this.normalizeError(exception);

    if (error.code === 'INTERNAL_ERROR') {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger.error(error.message, stack);
    }

    return throwError(() => error);
  }

  private normalizeError(exception: unknown): RpcErrorBody {
    const timestamp = new Date().toISOString();

    if (exception instanceof RpcException) {
      const rpcError = exception.getError();

      if (typeof rpcError === 'string') {
        return {
          code: 'RPC_ERROR',
          message: rpcError,
          timestamp
        };
      }

      if (rpcError && typeof rpcError === 'object') {
        const body = rpcError as Record<string, unknown>;

        return {
          code: String(body.code ?? 'RPC_ERROR'),
          message: this.extractMessage(body.message, 'RPC exception'),
          details: body.details,
          timestamp
        };
      }
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const status = exception.getStatus();
      const body = typeof response === 'object' && response !== null ? response as Record<string, unknown> : {};

      return {
        code: this.statusToCode(status),
        message: this.extractMessage(body.message, exception.message),
        details: body,
        timestamp
      };
    }

    return {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      timestamp
    };
  }

  private extractMessage(value: unknown, fallback: string): string | string[] {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return value;
    }

    return fallback;
  }

  private statusToCode(status: number): string {
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR'
    };

    return codes[status] ?? 'HTTP_ERROR';
  }
}
