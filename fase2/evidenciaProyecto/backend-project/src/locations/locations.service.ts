import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Location, LocationDocument } from './schemas/locations.schemas';

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) {}

  // Crear un Nuevo Lugar
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // Criterio de Aceptación: Validar que el nombre no esté repetido
    const existingLocation = await this.locationModel
      .findOne({ name: createLocationDto.name })
      .exec();
    if (existingLocation) {
      throw new ConflictException(`El lugar con nombre '${createLocationDto.name}' ya existe.`);
    }
    // Guarda y devuelve 201 Created
    const createdLocation = new this.locationModel(createLocationDto);
    return createdLocation.save();
  }

  // Obtener la Lista de Lugares
  async findAll(): Promise<Location[]> {
    // Devolver lista de lugares
    return this.locationModel.find().exec();
  }

  // Método para encontrar por ID y manejar el error 404
  async findOneById(id: string): Promise<Location> {
    const location = await this.locationModel.findById(id).exec();
    if (!location) {
      throw new NotFoundException(`Lugar con ID '${id}' no encontrado.`);
    }
    return location;
  }

  // Actualizar un Lugar Existente
  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    // Si ID no existe (404 Not Found)
    const updatedLocation = await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true }) // {new: true} para devolver el doc actualizado
      .exec();

    if (!updatedLocation) {
      throw new NotFoundException(`Lugar con ID '${id}' no encontrado.`);
    }
    // 200 OK documento actualizado
    return updatedLocation;
  }

  // Eliminar un Lugar
  async remove(id: string): Promise<void> {
    // Intenta eliminar
    const result = await this.locationModel.deleteOne({ _id: id }).exec();
    // ID no existente (404 Not Found)
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Lugar con ID '${id}' no encontrado.`);
      // 204 No Content
    }
  }
}
