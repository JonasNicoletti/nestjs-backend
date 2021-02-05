import { Module } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesController } from './entries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entry from './entities/entry.entity';
import { FeaturesModule } from '../features/features.module';

@Module({
  imports: [FeaturesModule, TypeOrmModule.forFeature([Entry])],
  controllers: [EntriesController],
  providers: [EntriesService],
})
export class EntriesModule {}
