import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { FindReservationsQueryDto } from './dto/find-reservations-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';


@ApiHeader({
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@ApiTags('Reservas')
@Controller('api/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 120000 } })// 5 peticiones cada 2 minutos
  @ApiOperation({ summary: 'Crear una nueva solicitud de reserva' })
  @ApiResponse({
    status: 201,
    description: 'Solicitud creada, pendiente de aprobación.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto, el horario ya está ocupado.',
  })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Obtener todas las reservas pendientes' })
  findAllPending() {
    return this.reservationsService.findAllPending();
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Obtener historial de reservas aprobadas/rechazadas',
  })
  findAllHistory() {
    return this.reservationsService.findAllHistory();
  }

  @Patch(':id/approve')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Aprobar una reserva' })
  approve(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reservationsService.approve(id);
  }

  @Patch(':id/reject')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Rechazar una reserva' })
  reject(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reservationsService.reject(id);
  }
  
  @Get('availability/:spaceId')
  @ApiOperation({
    summary: 'Obtener disponibilidad de un espacio para una fecha',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve una lista de reservas (pendientes y aprobadas) para ese día.',
  })
  findAvailability(
    @Param('spaceId', ParseMongoIdPipe) spaceId: string,
    @Query('date') date: string, // Recibe la fecha como query param, ej: ?date=2025-10-30
  ) {
    if (!date) {
      throw new BadRequestException(
        'Se requiere una fecha (date) en el query param.',
      );
    }
    return this.reservationsService.findAvailabilityBySpace(spaceId, date);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Obtener todas las reservas con filtros (Admin)',
    description:
      'Obtiene una lista de reservas. Permite filtrar por espacioId, fecha (YYYY-MM-DD), y estado (true, false, null). Si no se envían filtros, trae todo.',
  })
  @ApiQuery({ name: 'espacioId', required: false, type: String })
  @ApiQuery({ name: 'date', required: false, type: String, example: '2025-10-31' })
  @ApiQuery({ name: 'isApproved', required: false, enum: ['true', 'false', 'null'] })
  @ApiResponse({ status: 200, description: 'Lista de reservas filtradas.' })
  findAll(@Query() queryDto: FindReservationsQueryDto) {
    return this.reservationsService.findAll(queryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Eliminar una reserva por ID (Admin)' })
  @ApiResponse({ status: 204, description: 'Reserva eliminada exitosamente.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reservationsService.remove(id);
  }
}
