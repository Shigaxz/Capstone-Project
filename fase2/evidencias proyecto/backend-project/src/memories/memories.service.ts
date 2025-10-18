import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Memory, MemoryDocument } from './schemas/memory.schema';

@Injectable()
export class MemoriesService {

  constructor(
    @InjectModel(Memory.name)
    private readonly memoryModel: Model<MemoryDocument>,
  ) {}

  // Crea una nueva memoria
  async create(createMemoryDto: CreateMemoryDto): Promise<Memory> {
    const newMemory = new this.memoryModel(createMemoryDto);
    return newMemory.save();
  }

  // Obtiene todas las memorias
  async findAll(): Promise<Memory[]> {
    return this.memoryModel.find().exec();
  }
  // Obtiene una memoria por id
  async findOne(id: string): Promise<Memory> {
    const memory = await this.memoryModel.findById(id).exec();
    if (!memory) {
      throw new NotFoundException(`Memoria con ID '${id}' no encontrada.`);
    }
    return memory;
  }

  // Editar una memoria
  async update(id: string, updateMemoryDto: UpdateMemoryDto): Promise<Memory> {
    // No se maneja la modificacion de imagenes
    const updatedMemory = await this.memoryModel
      .findByIdAndUpdate(id, updateMemoryDto, { new: true })
      .exec();

    if (!updatedMemory) {
      throw new NotFoundException(`Memoria con ID '${id}' no encontrada.`);
    }
    return updatedMemory;
  }

  // Eliminamos una memoria
  async remove(id: string): Promise<void> {
    const memory = await this.findOne(id);
    await this.memoryModel.deleteOne({ _id: id }).exec();
  }
}
