import {
  IsArray,
  IsBoolean,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Min,
  Max,
  MinLength,
  ArrayUnique,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsInt()
  @Min(1)
  releaseYear: number;

  @IsInt()
  @Min(1)
  @Max(300)
  runtime: number;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsMongoId({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsBoolean()
  watched?: boolean;
}
