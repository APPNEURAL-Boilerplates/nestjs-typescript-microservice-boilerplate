import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class SumDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  numbers!: number[];
}
