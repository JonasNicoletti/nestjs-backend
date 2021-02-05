import { ApiProperty } from '@nestjs/swagger';
import Feature from '../../features/entities/feature.entity';
import User from '../../users/entities/user.entity';
import {
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

  @ManyToOne(() => Feature, (feature: Feature) => feature.entries)
  public feature: Feature;

  @ManyToOne(() => User, (user: User) => user.entries)
  public user: User;
}

export default Entry;
