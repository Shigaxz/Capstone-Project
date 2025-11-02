import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Space } from '../../spaces/schemas/space.schema';

export type ReservationDocument = Reservation & Document;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Space', required: true })
  espacioId: MongooseSchema.Types.ObjectId | Space;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: Boolean, default: null }) // Por defecto es null (null = pendiente)
  isApproved: boolean | null;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);