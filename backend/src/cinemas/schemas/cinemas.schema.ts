import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CinemaDocument = HydratedDocument<Cinema>;

@Schema({
  timestamps: true,
  collection: 'cinemas',
})
export class Cinema {
  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: [Number],
    required: true,
    validate: {
      validator: (sizes: number[]) =>
        sizes.length >= 1 &&
        sizes.length <= 10 &&
        sizes.every(
          (size) => Number.isInteger(size) && size >= 1 && size <= 500,
        ) &&
        new Set(sizes).size === sizes.length,
      message:
        'Bundle sizes must contain 1-10 unique integers between 1 and 500',
    },
  })
  bundleSizes: number[];
}

export const CinemaSchema = SchemaFactory.createForClass(Cinema);

CinemaSchema.index({ name: 1 }, { unique: true });
