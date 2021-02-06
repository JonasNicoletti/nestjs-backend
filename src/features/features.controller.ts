import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import Feature from './entities/feature.entity';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';

@Controller('features')
@ApiTags('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Feature,
  })
  @ApiCookieAuth()
  create(
    @Body() createFeatureDto: CreateFeatureDto,
    @Req() req: RequestWithUser,
  ): Promise<Feature> {
    return this.featuresService.create(createFeatureDto, req.user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: [Feature],
  })
  findAll(): Promise<Feature[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: Feature,
  })
  findOne(@Param('id') id: string): Promise<Feature> {
    return this.featuresService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Feature,
  })
  update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(Number(id), updateFeatureDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiCookieAuth()
  remove(@Param('id') id: string) {
    return this.featuresService.remove(Number(id));
  }
}
