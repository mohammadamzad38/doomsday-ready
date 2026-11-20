import { Module } from '@nestjs/common';
import { CinemasController } from './cinemas.controller.js';
import { CinemasService } from './cinemas.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Cinema, CinemaSchema } from './schemas/cinemas.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cinema.name,
        schema: CinemaSchema,
      },
    ]),
  ],
  controllers: [CinemasController],
  providers: [CinemasService],
})
export class CinemasModule {}
