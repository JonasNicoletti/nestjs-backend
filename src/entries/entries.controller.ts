import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EntriesService } from './entries.service';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import RequestWithUser from '../auth/interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from '../auth/guards/jwt-authentication.guard';
import Entry from './entities/entry.entity';

@Controller('entries')
@ApiTags('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post(':featureId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Entry,
  })
  @ApiCookieAuth()
  create(@Param('featureId') featureId: string, @Req() req: RequestWithUser) {
    return this.entriesService.create(Number(featureId), req.user);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    type: [Entry],
  })
  @ApiCookieAuth()
  findAll(@Req() req: RequestWithUser) {
    return this.entriesService.findAll(req.user);
  }

  @Get(':featureId')
  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({
    status: 200,
    type: [Entry],
  })
  @ApiCookieAuth()
  findByFeauture(
    @Param('featureId') featureId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.entriesService.findAllByFeature(featureId, req.user);
  }

  @Delete(':featureId/:id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiCookieAuth()
  remove(@Param('id') id: string) {
    return this.entriesService.remove(Number(+id));
  }
}
