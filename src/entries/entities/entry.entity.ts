import { ApiProperty } from '@nestjs/swagger';
import Feature from '../../features/entities/feature.entity';
import User from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Entry {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public id?: number;

  @ApiProperty()
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ nullable: true })
  public note?: string;

  @ManyToOne(() => Feature, (feature: Feature) => feature.entries)
  public feature: Feature;

  @ManyToOne(() => User, (user: User) => user.entries)
  public user: User;
}

export default Entry;
