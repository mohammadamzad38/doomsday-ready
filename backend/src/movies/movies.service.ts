import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema.js';
import { Model, Types } from 'mongoose';
import { CreateMovieDto } from './dto/create.movie.dto.js';
import { UpdateMovieDto } from './dto/update.movie.dto.js';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  private validateId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid movie ID');
    }
  }

  private async validatePrerequisites(ids: string[]) {
    if (!ids || ids.length === 0) {
      return;
    }

    const objectIds = ids.map((id) => new Types.ObjectId(id));

    const existingCount = await this.movieModel.countDocuments({
      _id: { $in: objectIds },
    });

    if (existingCount !== objectIds.length) {
      throw new NotFoundException(
        'One or more prerequisite movies were not found',
      );
    }
  }

  private async ensureNoCycle(
    movideId: Types.ObjectId,
    prerequisites: Types.ObjectId[],
  ): Promise<void> {
    const movies = await this.movieModel
      .find({}, { _id: 1, prerequisites: 1 })
      .lean()
      .exec();

    const graph = new Map<string, string[]>();

    for (const movie of movies) {
      graph.set(
        String(movie._id),
        (movie.prerequisites ?? []).map((id) => String(id)),
      );
    }

    graph.set(
      movideId.toString(),
      prerequisites.map((id) => id.toString()),
    );

    const visiting = new Set<string>();
    const visited = new Set<String>();

    const hasCycle = (id: string): boolean => {
      if (visiting.has(id)) return true;
      if (visited.has(id)) return false;

      visiting.add(id);

      for (const prerequisiteId of graph.get(id) ?? []) {
        if (hasCycle(prerequisiteId)) return true;
      }

      visiting.delete(id);
      visited.add(id);

      return false;
    };

    for (const id of graph.keys()) {
      if (hasCycle(id)) {
        throw new ConflictException({
          statusCode: 409,
          error: 'conflict',
          code: 'CIRCULAR_DEPENDENCY',
          message: 'This dependency would cerate a circular dependency',
        });
      }
    }
  }

  async create(createMovieDto: CreateMovieDto) {
    const prerequisites = (createMovieDto.prerequisites ?? []).map(
      (id) => new Types.ObjectId(id),
    );

    await this.validatePrerequisites(createMovieDto.prerequisites ?? []);

    const movieId = new Types.ObjectId();

    await this.ensureNoCycle(movieId, prerequisites);

    try {
      const movie = await this.movieModel.create({
        ...createMovieDto,
        title: createMovieDto.title.trim(),
        prerequisites,
      });

      return {
        message: 'movie created',
        movie,
      };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('Movie title already exists');
      }

      throw error;
    }
  }

  async findAll() {
    return this.movieModel.find().sort({ createAt: -1 }).exec();
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    this.validateId(id);

    const existMovie = await this.movieModel.findById(id).exec();

    if (!existMovie) {
      throw new NotFoundException('Movie not found');
    }

    const prerequisites =
      updateMovieDto.prerequisites !== undefined
        ? updateMovieDto.prerequisites.map((item) => new Types.ObjectId(item))
        : existMovie.prerequisites;

    if (updateMovieDto.prerequisites !== undefined) {
      await this.validatePrerequisites(updateMovieDto.prerequisites);
    }

    await this.ensureNoCycle(existMovie._id, prerequisites);

    const updateData = {
      ...updateMovieDto,
      ...(updateMovieDto.title !== undefined && {
        title: updateMovieDto.title.trim(),
      }),

      prerequisites,
    };

    try {
      const updateMovie = await this.movieModel
        .findByIdAndUpdate(
          id,
          {
            $set: updateData,
          },
          { new: true, runValidators: true },
        )
        .exec();

      return updateMovie;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('Movie title already exists');
      }

      throw error;
    }
  }

  async getRewatchOrder(id: string) {
    this.validateId(id);

    const movies = await this.movieModel.find().lean().exec();

    const movieMap = new Map(movies.map((movie) => [String(movie._id), movie]));

    const targetMovie = movieMap.get(id);

    if (!targetMovie) {
      throw new NotFoundException('Movie not found');
    }

    const visited = new Set<string>();
    const visiting = new Set<string>();
    const reWatchOrder: typeof movies = [];

    const visit = (movieId: string): void => {
      if (visited.has(movieId)) return;

      if (visiting.has(movieId)) {
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          code: 'CIRCULAR_DEPENDENCY',
          message: 'Circular dependency detected',
        });
      }

      const movie = movieMap.get(movieId);

      if (!movie) return;

      visiting.add(movieId);

      for (const prerequisiteId of movie?.prerequisites ?? []) {
        visit(String(prerequisiteId));
      }

      visiting.delete(movieId);
      visited.add(movieId);

      reWatchOrder.push(movie);
    };

    for (const prerequisiteId of targetMovie.prerequisites ?? []) {
      visit(String(prerequisiteId));
    }

    const watchedCount = reWatchOrder.filter((movie) => movie.watched).length;

    const totalUnwatchedRuntime = reWatchOrder.reduce(
      (total, movie) => total + (movie.watched ? 0 : movie.runtime),
      0,
    );

    return {
      targetMovie,
      reWatchOrder,
      watchedCount,
      totalUnwatchedRuntime,
    };
  }
}
