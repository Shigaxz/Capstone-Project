import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { addMinutes } from 'date-fns';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Space } from '../spaces/schemas/space.schema';
import { FindReservationsQueryDto } from './dto/find-reservations-query.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { espacioId, email, startTime, duration } = createReservationDto;

    const start = new Date(startTime);
    const end = addMinutes(start, duration);

    // Verificación de colisión
    const existingReservation = await this.reservationModel
      .findOne({
        espacioId,
        isApproved: { $ne: false }, // No chocar con aprobadas o pendientes
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
      })
      .exec();

    if (existingReservation) {
      throw new ConflictException(
        'El horario seleccionado ya está ocupado o pendiente de aprobación.',
      );
    }

    const newReservation = new this.reservationModel({
      espacioId,
      email,
      startTime: start,
      endTime: end,
      isApproved: null, // Estado pendiente
    });

    return newReservation.save();
  }

  async findAllPending(): Promise<Reservation[]> {
    return this.reservationModel
      .find({ isApproved: null })
      .populate('espacioId')
      .exec();
  }

  async findAllHistory(): Promise<Reservation[]> {
    return this.reservationModel
      .find({ isApproved: { $in: [true, false] } })
      .populate('espacioId')
      .exec();
  }

  private async findById(id: string): Promise<ReservationDocument> {
    const reservation = await this.reservationModel.findById(id).populate<Space>('espacioId').exec();
    if (!reservation) {
      throw new NotFoundException(`Reserva con ID '${id}' no encontrada.`);
    }
    return reservation;
  }

  async approve(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);

    reservation.isApproved = true;
    await reservation.save();

    // Prepara los datos 
    const spaceName = (reservation.espacioId as Space)?.name || 'Espacio Desconocido';
    const emailUsuario = reservation.email.split('@')[0];
    const fechaReserva = format(reservation.startTime, "eeee, dd 'de' MMMM 'de' yyyy", { locale: es });
    const horaInicio = format(reservation.startTime, "HH:mm 'hrs.'", { locale: es });
    const horaFin = format(reservation.endTime, "HH:mm 'hrs.'", { locale: es });

    // Enviar correo usando la plantilla
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: `¡Tu reserva en CITT ha sido aprobada! [${spaceName}]`,
      template: 'aprobado',
      context: {
        emailUsuario: emailUsuario,
        spaceName: spaceName,
        fechaReserva: fechaReserva,
        horaInicio: horaInicio,
        horaFin: horaFin,
      },
    });

    return reservation;
  }

  async reject(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);

    reservation.isApproved = false;
    await reservation.save();

    // Prepara los datos
    const spaceName = (reservation.espacioId as Space)?.name || 'Espacio Desconocido';
    const emailUsuario = reservation.email.split('@')[0];
    const fechaReserva = format(reservation.startTime, "dd 'de' MMMM", { locale: es });
    const horaInicio = format(reservation.startTime, "HH:mm 'hrs.'", { locale: es });

    // Enviar correo usando plantilla
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: `Actualización sobre tu reserva en CITT [${spaceName}]`,
      
      template: 'rechazado',
      context: {
        emailUsuario: emailUsuario,
        spaceName: spaceName,
        fechaReserva: fechaReserva,
        horaInicio: horaInicio,
      },
    });

    return reservation;
  }

  async findAvailabilityBySpace(
    spaceId: string,
    date: string,
  ): Promise<Reservation[]> {
    // 1. Crea el inicio del DÍA en UTC
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Ej: 2025-10-30T00:00:00.000Z

    // 2. Crea el fin del DÍA en UTC
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // Ej: 2025-10-30T23:59:59.999Z

    return this.reservationModel
      .find({
        espacioId: spaceId,
        isApproved: { $ne: false },
        startTime: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .exec();
  }

  async findAll(queryDto: FindReservationsQueryDto): Promise<Reservation[]> {
    const { espacioId, date, isApproved } = queryDto;
    // Construye el filtro dinámicamente
    const query: FilterQuery<ReservationDocument> = {};

    // Añade filtro de espacioId si existe
    if (espacioId) {
      query.espacioId = espacioId;
    }
    // Añade filtro de estado si existe
    if (isApproved !== undefined) {
      if (isApproved === 'null') {
        query.isApproved = null;
      } else if (isApproved === 'true') {
        query.isApproved = true;
      } else if (isApproved === 'false') {
        query.isApproved = false;
      }
    }
    // Añade filtro de fecha si existe
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.startTime = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }
    // Ejecuta la consulta con el filtro dinámico y popúla el espacio
    return this.reservationModel
      .find(query)
      .populate('espacioId')
      .sort({ startTime: -1 })
      .exec();
  }

  async remove(id: string): Promise<void> {
    // Intenta eliminar el documento
    const result = await this.reservationModel.deleteOne({ _id: id }).exec();
    // Si no se borró nada
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Reserva con ID '${id}' no encontrada.`);
    }
  }
}
