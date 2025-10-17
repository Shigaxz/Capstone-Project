import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { addMinutes } from 'date-fns';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { espacioId, email, startTime, duration } = createReservationDto;
    
    const start = new Date(startTime);
    const end = addMinutes(start, duration);

    // Verificación de colisión
    const existingReservation = await this.reservationModel.findOne({
      espacioId,
      isApproved: { $ne: false }, // No chocar con aprobadas o pendientes
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
      ],
    }).exec();

    if (existingReservation) {
      throw new ConflictException('El horario seleccionado ya está ocupado o pendiente de aprobación.');
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
    return this.reservationModel.find({ isApproved: null }).populate('espacioId').exec();
  }

  async findAllHistory(): Promise<Reservation[]> {
    return this.reservationModel.find({ isApproved: { $in: [true, false] } }).populate('espacioId').exec();
  }
  
  private async findById(id: string): Promise<ReservationDocument> {
      const reservation = await this.reservationModel.findById(id).exec();
      if (!reservation) {
          throw new NotFoundException(`Reserva con ID '${id}' no encontrada.`);
      }
      return reservation;
  }

  async approve(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    
    reservation.isApproved = true;
    await reservation.save();
    
    // Enviar correo de aprobación
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: '¡Tu reserva en CITT ha sido aprobada!',
      html: `Hola, tu reserva para el día ${reservation.startTime.toLocaleString()} ha sido aprobada.`,
    });
    
    return reservation;
  }

  async reject(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);

    reservation.isApproved = false;
    await reservation.save();

    // Enviar correo de rechazo
    await this.mailerService.sendMail({
      to: reservation.email,
      subject: 'Actualización sobre tu reserva en CITT',
      html: `Hola, lamentamos informarte que tu reserva para el día ${reservation.startTime.toLocaleString()} ha sido rechazada.`,
    });

    return reservation;
  }
}
