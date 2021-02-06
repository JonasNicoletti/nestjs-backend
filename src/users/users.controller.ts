import {
  Controller,
  Get,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import User from './entities/user.entity';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: User,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Get(':email')
  @ApiResponse({
    status: 200,
    type: User,
  })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiCookieAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiCookieAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }
}
