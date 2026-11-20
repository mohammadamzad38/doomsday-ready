import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cinema } from './schemas/cinemas.schema.js';
import { CreateCinemaDto } from './dto/create.cenema.dto.js';

@Injectable()
export class CinemasService {
  constructor(
    @InjectModel(Cinema.name)
    private readonly cinemaModel: Model<Cinema>,
  ) {}

  async create(createCinemaDto: CreateCinemaDto) {
    try {
      return await this.cinemaModel.create({
        ...createCinemaDto,
        name: createCinemaDto.name.trim(),
      });
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new ConflictException('Cinema name already exists');
      }

      throw error;
    }
  }

  async findAll() {
    return this.cinemaModel.find().sort({ createdAt: -1 }).exec();
  }

  async getBooking(id: string, groupSize: number) {
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      throw new BadRequestException('Invalid cinema ID');
    }

    if (!Number.isInteger(groupSize) || groupSize < 1 || groupSize > 10000) {
      throw new BadRequestException(
        'groupSize must be an integer between 1 and 10000',
      );
    }

    const cinema = await this.cinemaModel.findById(id).exec();

    if (!cinema) {
      throw new NotFoundException('Cinema not found');
    }

    const bundles = [...cinema.bundleSizes].sort((a, b) => a - b);

    const dp = new Array<number>(groupSize + 1).fill(Infinity);

    const choice = new Array<number>(groupSize + 1).fill(0);

    dp[0] = 0;

    for (let seats = 1; seats <= groupSize; seats++) {
      for (const bundleSize of bundles) {
        if (bundleSize <= seats && dp[seats - bundleSize] !== Infinity) {
          const candidate = dp[seats - bundleSize] + 1;

          if (candidate < dp[seats]) {
            dp[seats] = candidate;
            choice[seats] = bundleSize;
          }
        }
      }
    }

    if (dp[groupSize] === Infinity) {
      return {
        possible: false,
        groupSize,
        message: 'No exact bundle combination is possible',
      };
    }

    const selectedBundles: number[] = [];
    let remainingSeats = groupSize;

    while (remainingSeats > 0) {
      const selectedSize = choice[remainingSeats];

      selectedBundles.push(selectedSize);
      remainingSeats -= selectedSize;
    }

    const bundleBreakdown = selectedBundles.reduce(
      (result, size) => {
        result[size] = (result[size] ?? 0) + 1;
        return result;
      },
      {} as Record<number, number>,
    );

    return {
      possible: true,
      cinema: cinema.name,
      groupSize,
      totalBundles: selectedBundles.length,
      selectedBundles,
      bundleBreakdown,
    };
  }
}
