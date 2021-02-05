import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import User from './entities/user.entity';
import { PublicUserDto } from './dto/public-user.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [PublicUserDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: PublicUserDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Get(':email')
  @ApiResponse({
    status: 200,
    type: PublicUserDto,
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
