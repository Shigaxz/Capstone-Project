import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Memory, MemoryDocument } from './schemas/memory.schema';
import { S3File } from '../common/interfaces/s3-file.interface';

@Injectable()
export class MemoriesService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectModel(Memory.name)
    private readonly memoryModel: Model<MemoryDocument>,
    private readonly configService: ConfigService,
  ) {
    // Configura el cliente de S3 una vez en el constructor
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!
    });
  }

  // Crea una nueva memoria
  async create(
    createMemoryDto: CreateMemoryDto,
    // Archivo que se almacenara en un bucket AWS S3
    files: Array<S3File>,
  ): Promise<Memory> {
    const imageUrls = files.map((file) => file.location);

    const newMemory = new this.memoryModel({
      ...createMemoryDto,
      images: imageUrls,
    });

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
    // Si tiene imagenes, se borraran desde el bucket tambien
    if (memory.images && memory.images.length > 0) {
      const deletePromises = memory.images.map((fileUrl) => this.deleteS3File(fileUrl));
      await Promise.all(deletePromises);
    }
    // Se elimina el documento correspondiente a la memoria
    await this.memoryModel.deleteOne({ _id: id }).exec();
  }

  // Funcion para borrar foto del bucket
  private async deleteS3File(fileUrl: string): Promise<void> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const key = new URL(fileUrl).pathname.substring(1); // Obtiene la llave de la url de la imagen

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Error al eliminar el archivo ${key} de S3:`, error);
    }
  }
}