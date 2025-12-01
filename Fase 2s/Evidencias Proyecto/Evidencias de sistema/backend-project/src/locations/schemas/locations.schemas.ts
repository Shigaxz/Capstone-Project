import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';


export type LocationDocument = Location & Document;

@Schema({ timestamps: true }) // timestamps añade createdAt y updatedAt
export class Location {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true })
  floor: number;

  // Referencia a los espacios. Asumimos que tienes un modelo 'Espacio'.
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Espacio' }] })
  espacioId: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true, default: true })
  isAvailable: boolean;

  @Prop({ required: false, trim: true })
  urlImage: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);