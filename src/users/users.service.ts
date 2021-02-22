import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne(
      { email },
      {
        relations: ['features', 'entries'],
      },
    );
    if (user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      relations: ['features', 'entries'],
    });
    if (user === undefined) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne(id);
    if (updatedUser) {
      return updatedUser;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  async remove(id: number) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentHashedRefreshToken,
    });
  }

  async setResetPwdToken(token: string, userId: number) {
    await this.userRepository.update(userId, {
      resetPasswordToken: token,
    });
  }

  async resetPwd(token: string, newPassword: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user) {
      throw new HttpException(
        'Token with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    const isTokenValid = this.validateToken(token, user.resetPasswordToken);
    if (!isTokenValid) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const hashedPwd = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      password: hashedPwd,
      resetPasswordToken: null,
    });
    return this.userRepository.findOne(user.id);
  }

  async getById(id: number) {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);

    const isRefreshTokenMatching = await this.validateToken(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  private async validateToken(token, dbToken): Promise<boolean> {
    const isTokenMatching = await bcrypt.compare(token, dbToken);

    return isTokenMatching;
  }

  async removeRefreshToken(userId: number) {
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
    });
  }
}
