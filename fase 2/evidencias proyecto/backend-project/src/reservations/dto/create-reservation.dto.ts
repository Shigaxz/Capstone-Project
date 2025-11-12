import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsMongoId,
  IsDateString,
  IsNumber,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID del espacio a reservar', example: '651a5b8d3f8e2c1b8d4c8e0a' })
  @IsMongoId()
  @IsNotEmpty()
  readonly espacioId: string;

  @ApiProperty({ description: 'Email institucional del solicitante', example: 'estudiante@duocuc.cl' })
  @IsEmail()
  @Matches(/@duocuc\.cl$/, { message: 'El correo debe ser institucional (@duocuc.cl)' })
  @IsNotEmpty()
  readonly email: string;
  
  @ApiProperty({ description: 'Fecha y hora de inicio de la reserva (formato ISO 8601)', example: '2025-10-20T14:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  readonly startTime: string;

  @ApiProperty({ description: 'Duración de la reserva en minutos (solo 30 o 60)', example: 30 })
  @IsNumber()
  @IsIn([30, 60]) // Solo permite duraciones de 30 o 60 minutos
  @IsNotEmpty()
  readonly duration: number;
}