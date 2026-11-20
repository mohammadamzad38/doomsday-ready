import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({
  timestamps: true,
  collection: 'movies',
})
export class Movie {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  title: string;

  @Prop({
    required: true,
    min: 1,
  })
  releaseYear: number;

  @Prop({
    required: true,
    min: 1,
    max: 300,
  })
  runtime: number;

  @Prop({
    type: [Types.ObjectId],
    ref: Movie.name,
    default: [],
  })
  prerequisites: Types.ObjectId[];

  @Prop({
    type: Boolean,
    default: false,
  })
  watched: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ title: 1 }, { unique: true });
