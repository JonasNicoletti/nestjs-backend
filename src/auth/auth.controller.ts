import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import User from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { UsersService } from 'src/users/users.service';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import RequestWithRegister from './interfaces/requestWithRegister.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { URL } from 'url';
import { ChangePwdDto } from './interfaces/changePwd.dto';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
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
    const {
      cookie,
      refreshToken,
    } = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.usersService.setCurrentRefreshToken(refreshToken, +user.id);
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
    const { accessTokenCookie, cookie } = await this.authService.updateTokens(
      +user.id,
    );
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

  @UseGuards(JwtAuthenticationGuard)
  @Post('reset-password-request')
  @ApiResponse({
    status: 200,
  })
  @HttpCode(200)
  async resetPasswordRequest(@Req() request: RequestWithUser) {
    const origin = request.get('origin');
    const user = request.user;
    const token = this.authService.generateUserResetPwdToken(user.id);
    this.usersService.setResetPwdToken(token, +user.id);
    const url = new URL('/reset/' + token, origin).href;
    this.emailService.sendMail({
      text: 'Hello, \nCick here to reset your password:\n' + url,
      to: user.email,
      subject: 'Reset-Email',
    });
    request.res.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('reset-password')
  @ApiResponse({
    status: 200,
  })
  @HttpCode(200)
  async resetPassword(
    @Body() changePwdDto: ChangePwdDto,
    @Req() request: RequestWithUser,
  ) {
    const user = request.user;
    const { newPassword, token } = changePwdDto;
    const updatedUser = this.usersService.resetPwd(
      token,
      newPassword,
      +user.id,
    );
    const { accessTokenCookie, cookie } = await this.authService.updateTokens(
      +user.id,
    );
    request.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
    return updatedUser;
  }
}
