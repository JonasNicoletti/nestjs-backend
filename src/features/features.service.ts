import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import Feature from './entities/feature.entity';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature) private featureRepository: Repository<Feature>,
  ) {}

  async create(
    createFeatureDto: CreateFeatureDto,
    owner: User,
  ): Promise<Feature> {
    const newFeature = this.featureRepository.create({
      ...createFeatureDto,
      users: [owner],
    });
    await this.featureRepository.save(newFeature);
    return newFeature;
  }

  findAll(): Promise<Feature[]> {
    return this.featureRepository.find({ relations: ['users'] });
  }

  async findOne(id: number): Promise<Feature> {
    const feature = await this.featureRepository.findOne(id, {
      relations: ['users'],
    });
    if (feature === undefined) {
      throw new HttpException('Feature not found', HttpStatus.NOT_FOUND);
    }
    return feature;
  }

  async update(
    id: number,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    await this.featureRepository.update(id, updateFeatureDto);
    const updatedFeature = await this.featureRepository.findOne(id, {
      relations: ['owner'],
    });
    if (updatedFeature) {
      return updatedFeature;
    }
    throw new HttpException('Feature not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.featureRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Feature not found', HttpStatus.NOT_FOUND);
    }
  }
}
