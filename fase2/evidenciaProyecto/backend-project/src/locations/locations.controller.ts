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

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}
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
}
