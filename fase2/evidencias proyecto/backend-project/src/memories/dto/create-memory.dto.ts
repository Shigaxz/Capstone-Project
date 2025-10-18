import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  ArrayMinSize,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemoryDto {
  @ApiProperty({
    description: 'Título principal de la memoria.',
    example: 'Reserva de espacio y memorias CITT',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: 'Lista con los nombres de los integrantes del proyecto.',
    example: ['Pedro Gonzalez', 'Juan Pérez'],
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly members: string[];

  @ApiProperty({
    description: 'Nombre del profesor guía de la memoria.',
    example: 'Profesor...',
  })
  @IsString()
  @IsNotEmpty()
  readonly teacher: string;

  @ApiProperty({
    description: 'Empresa asociada al proyecto (opcional).',
    example: 'Centro de Innovacion y Transferencia Tecnologica',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly company?: string;

  @ApiProperty({
    description: 'Año de desarrollo de la memoria.',
    example: 2025,
  })
  @IsNumber()
  @Type(() => Number) // Transforma el string del form-data a número
  @IsNotEmpty()
  readonly year: number;

  @ApiProperty({
    description: 'Array de URLs de las imágenes de la memoria.',
    example: ['https://ejemplo.com/foto1.jpg', 'https://ejemplo.com/foto2.png'],
    required: false,
  })
  @IsArray()
  @IsUrl({}, { each: true, message: 'Cada imagen debe ser una URL válida' })
  @IsOptional()
  readonly images?: string[];
}
