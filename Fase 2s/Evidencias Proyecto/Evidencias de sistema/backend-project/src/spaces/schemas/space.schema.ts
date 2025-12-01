import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SpaceDocument = Space & Document;

@Schema({ timestamps: true })
export class Space {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
  lugarId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);