import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
export class ChangePwdDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    token: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    newPassword: string;
}
