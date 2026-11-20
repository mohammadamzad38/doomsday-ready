import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MoviesService } from './movies.service.js';
import { CreateMovieDto } from './dto/create.movie.dto.js';
import { UpdateMovieDto } from './dto/update.movie.dto.js';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMOvieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMOvieDto);
  }

  @Get(':id/rewatch-order')
  getRewatchOrder(@Param('id') id: string) {
    return this.moviesService.getRewatchOrder(id);
  }
}
