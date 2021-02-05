import { OmitType } from '@nestjs/swagger/';
import Feature from '../entities/feature.entity';

export class CreateFeatureDto extends OmitType(Feature, ['id'] as const) {}
