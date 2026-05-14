import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreatedEventDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsEmail()
  email!: string;
}
