import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller.js';
import { MoviesService } from './movies.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesModule],
})
export class MoviesModule {}
