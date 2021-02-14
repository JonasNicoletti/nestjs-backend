import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeaturesService } from '../features/features.service';
import User from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import Entry from './entities/entry.entity';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>,
    private readonly featureService: FeaturesService,
  ) { }

  async create(
    featureId: number,
    createEntryDto: CreateEntryDto,
    user: User,
  ): Promise<Entry> {
    const feature = await this.featureService.findOne(featureId);
    const newEntry = this.entryRepository.create({
      note: createEntryDto.note,
      user: user,
      feature: feature,
    });
    await this.entryRepository.save(newEntry);

    return newEntry;
  }

  findAll(user: User): Promise<Entry[]> {
    return this.entryRepository.find({
      where: { user: { id: user.id } },
    });
  }

  findAllByFeature(featureId: string, user: User) {
    return this.entryRepository.find({
      where: { user: { id: user.id }, feature: { id: featureId } },
    });
  }

  async remove(id: number) {
    const deleteResponse = await this.entryRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Feature not found', HttpStatus.NOT_FOUND);
    }
  }
}
