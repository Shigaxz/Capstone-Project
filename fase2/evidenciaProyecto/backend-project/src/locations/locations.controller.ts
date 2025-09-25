import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { SpacesService } from '../spaces/spaces.service';
import { CreateSpaceDto } from '../spaces/dto/create-space.dto';

@Controller('api/locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly spacesService: SpacesService,) {}
  // Metodo Post: Para agregar Lugares
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  // Metodo get: Para obtener todos los Lugares
  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  // Metodo get:id: Para obtener Lugar por Id
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    // Llama al método del servicio que busca por ID
    return this.locationsService.findOneById(id);
  }

  // Metodo Patch: Para actualizar el Lugar
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  // Metodo Delete: Para eliminar el Lugar
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.locationsService.remove(id);
  }
  // Metodo Post: Para agregar espacio por con Lugar Id
  @Post(':locationId/spaces')
  @HttpCode(HttpStatus.CREATED)
  createSpace(
    @Param('locationId', ParseMongoIdPipe) locationId: string,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return this.spacesService.create(locationId, createSpaceDto);
  }
  // Metodo Get: Para obtener espacio por con Lugar Id
  @Get(':locationId/spaces')
  findSpacesByLocation(
    @Param('locationId', ParseMongoIdPipe) locationId: string,
  ) {
    return this.spacesService.findAllByLocation(locationId);
  }
}
