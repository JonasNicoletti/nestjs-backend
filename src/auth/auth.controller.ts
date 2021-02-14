import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import User from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { UsersService } from 'src/users/users.service';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import RequestWithRegister from './interfaces/requestWithRegister.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('register')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @ApiBody({
    type: CreateUserDto,
  })
  async register(@Req() request: RequestWithRegister): Promise<User> {
    const user = await this.authService.register(request.body as CreateUserDto);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie, token } = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    await this.usersService.setCurrentRefreshToken(token, +user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiResponse({
    status: 200,
  })
  @ApiBody({
    type: User,
  })
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const { cookie, token } = this.authService.getCookieWithJwtRefreshToken(
      user.id,
    );
    await this.usersService.setCurrentRefreshToken(token, +user.id);
    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @ApiResponse({
    status: 200,
  })
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    console.log('here');
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
