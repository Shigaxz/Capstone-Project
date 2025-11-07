import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemoryDocument = Memory & Document;

@Schema({ timestamps: true })
export class Memory {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ type: [String], required: true })
  members: string[];

  @Prop({ required: true })
  teacher: string;

  @Prop({ required: false })
  company?: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  images: string[]; // Array de enlaces
}

export const MemorySchema = SchemaFactory.createForClass(Memory);