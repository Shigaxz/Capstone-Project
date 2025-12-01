import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty({
    description: 'Nombre descriptivo del espacio',
    example: 'FabLab',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'Capacidad de personas que admite el espacio',
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  readonly capacity: number;

  @ApiProperty({
    description: 'Indica si el espacio está disponible. Opcional, por defecto es true.',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly isAvailable?: boolean;
}
