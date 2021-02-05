import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import Entry from '../../entries/entities/entry.entity';
import Feature from '../../features/entities/feature.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id?: number;

  @ApiProperty()
  @IsEmail()
  @Column({ unique: true })
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Column()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Exclude()
  @Column()
  public password: string;

  @ManyToMany(() => Feature, (feature: Feature) => feature.users)
  public features: Feature[];

  @OneToMany(() => Entry, (entry: Entry) => entry.user)
  public entries: Entry[];
}

export default User;
