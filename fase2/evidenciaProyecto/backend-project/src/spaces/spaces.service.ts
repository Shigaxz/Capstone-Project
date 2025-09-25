import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Space, SpaceDocument } from './schemas/space.schema';
import { LocationsService } from '../locations/locations.service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectModel(Space.name)
    private readonly spaceModel: Model<SpaceDocument>,
    @Inject(forwardRef(() => LocationsService)) // Inyección para dependencia circular
    private readonly locationsService: LocationsService,
  ) {}

  // Crear un espacio y vincularlo a un lugar
  async create(
    locationId: string,
    createSpaceDto: CreateSpaceDto,
  ): Promise<Space> {
    await this.locationsService.findOneById(locationId); // Verifica que el lugar exista (criterio 404)

    const newSpace = new this.spaceModel({
      ...createSpaceDto,
      lugarId: locationId,
    });

    await newSpace.save();
    // Actualiza el documento Lugar para añadir el ID del nuevo espacio
    await this.locationsService.addSpaceToLocation(
      locationId,
      newSpace._id as MongooseSchema.Types.ObjectId,
    );
    return newSpace;
  }

  // Obtener todos los espacios
  async findAll(): Promise<Space[]> {
    return this.spaceModel.find().exec();
  }

  // Obtener espacios de un lugar específico
  async findAllByLocation(locationId: string): Promise<Space[]> {
    await this.locationsService.findOneById(locationId); // Verifica que el lugar exista
    return this.spaceModel.find({ lugarId: locationId }).exec();
  }

  // Obtener un espacio por su ID
  async findOne(id: string): Promise<Space> {
    const space = await this.spaceModel.findById(id).exec();
    if (!space) {
      throw new NotFoundException(`Espacio con ID '${id}' no encontrado.`);
    }
    return space;
  }

  // Actualizar un espacio
  async update(id: string, updateSpaceDto: UpdateSpaceDto): Promise<Space> {
    const updatedSpace = await this.spaceModel
      .findByIdAndUpdate(id, updateSpaceDto, { new: true })
      .exec();

    if (!updatedSpace) {
      throw new NotFoundException(`Espacio con ID '${id}' no encontrado.`);
    }
    return updatedSpace;
  }

  // Eliminar un espacio y desvincularlo
  async remove(id: string): Promise<void> {
    const space = await this.findOne(id); // Verifica que el espacio exista y obtiene su lugarId

    // Actualiza el Lugar para quitar la referencia al espacio
    await this.locationsService.removeSpaceFromLocation(space.lugarId, id);

    // Elimina el documento Espacio
    await this.spaceModel.deleteOne({ _id: id }).exec();
  }
}
