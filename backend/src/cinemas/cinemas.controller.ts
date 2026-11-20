import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CinemasService } from './cinemas.service.js';
import { CreateCinemaDto } from './dto/create.cenema.dto.js';

@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Post()
  create(@Body() createCinemaDto: CreateCinemaDto) {
    return this.cinemasService.create(createCinemaDto);
  }

  @Get()
  findAll() {
    return this.cinemasService.findAll();
  }

  @Get(':id/booking')
  getBooking(
    @Param('id') id: string,
    @Query('groupsize', ParseIntPipe) groupesize: number,
  ) {
    return this.cinemasService.getBooking(id, groupesize);
  }
}
