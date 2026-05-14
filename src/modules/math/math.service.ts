import { Injectable, Logger } from '@nestjs/common';
import { UserCreatedEventDto } from './dto/user-created-event.dto';

@Injectable()
export class MathService {
  private readonly logger = new Logger(MathService.name);

  sum(numbers: number[]): number {
    return numbers.reduce((total, value) => total + value, 0);
  }

  handleUserCreated(event: UserCreatedEventDto): void {
    this.logger.log(`Received user.created event for ${event.email}`);
  }
}
