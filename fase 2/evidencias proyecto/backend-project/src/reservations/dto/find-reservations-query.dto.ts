// src/reservations/dto/find-reservations-query.dto.ts
import { IsOptional, IsString, IsMongoId, IsDateString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindReservationsQueryDto {
  @ApiPropertyOptional({ 
    description: 'Filtrar por ID de espacio', 
    example: '68f7d322b53a3c0fa899cc81' 
  })
  @IsOptional()
  @IsMongoId({ message: 'El espacioId debe ser un MongoID válido' })
  espacioId?: string;

  @ApiPropertyOptional({ 
    description: 'Filtrar por fecha específica (YYYY-MM-DD)', 
    example: '2025-10-31' 
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe estar en formato YYYY-MM-DD' })
  date?: string;

  @ApiPropertyOptional({ 
    description: "Filtrar por estado: 'true' (aprobado), 'false' (rechazado), 'null' (pendiente)", 
    example: 'null',
    enum: ['true', 'false', 'null']
  })
  @IsOptional()
  @IsIn(['true', 'false', 'null'], { message: "isApproved debe ser 'true', 'false', o 'null'" })
  isApproved?: string;
}