import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { SumDto } from './dto/sum.dto';
import { UserCreatedEventDto } from './dto/user-created-event.dto';
import { MathService } from './math.service';

type HealthResponse = {
  ok: true;
  service: string;
  uptime: number;
  timestamp: string;
};

@Controller()
export class MathController {
  constructor(
    private readonly mathService: MathService,
    private readonly configService: ConfigService
  ) {}

  @MessagePattern({ cmd: 'health' })
  health(): HealthResponse {
    return {
      ok: true,
      service: this.configService.get<string>('SERVICE_NAME') ?? 'math-service',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }

  @MessagePattern({ cmd: 'sum' })
  sum(@Payload() payload: SumDto): { ok: true; result: number } {
    return {
      ok: true,
      result: this.mathService.sum(payload.numbers)
    };
  }

  @EventPattern('user.created')
  handleUserCreated(@Payload() payload: UserCreatedEventDto): void {
    this.mathService.handleUserCreated(payload);
  }
}
