import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly capacity: number;

  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;
}
