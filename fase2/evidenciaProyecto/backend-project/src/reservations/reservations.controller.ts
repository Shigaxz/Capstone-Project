import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

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
  @ApiOperation({ summary: 'Crear una nueva solicitud de reserva' })
  @ApiResponse({ status: 201, description: 'Solicitud creada, pendiente de aprobación.' })
  @ApiResponse({ status: 409, description: 'Conflicto, el horario ya está ocupado.' })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Obtener todas las reservas pendientes' })
  findAllPending() {
    return this.reservationsService.findAllPending();
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener historial de reservas aprobadas/rechazadas' })
  findAllHistory() {
    return this.reservationsService.findAllHistory();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Aprobar una reserva' })
  approve(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reservationsService.approve(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rechazar una reserva' })
  reject(@Param('id', ParseMongoIdPipe) id: string) {
    return this.reservationsService.reject(id);
  }
}