import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequest {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
