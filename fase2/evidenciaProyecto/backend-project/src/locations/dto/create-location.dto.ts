import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly floor: number;

  @IsArray()
  @IsMongoId({ each: true }) // Valida que cada elemento del array sea un MongoID
  @IsOptional()
  readonly espacioId?: string[];

  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;
}
