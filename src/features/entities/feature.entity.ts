import { ApiProperty } from '@nestjs/swagger';
import Entry from '../../entries/entities/entry.entity';
import User from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
class Feature {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  public id: number;

  @Column()
  @ApiProperty()
  public title: string;

  @ManyToMany(() => User, (user: User) => user.features)
  @JoinTable()
  public users: User[];

  @OneToMany(() => Entry, (entry: Entry) => entry.feature)
  public entries: Entry[];
}

export default Feature;
