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
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Space } from '../spaces/schemas/space.schema';
import { Location } from './schemas/locations.schemas';
import { AuthGuard } from '@nestjs/passport';

@ApiHeader({ 
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@ApiTags('Lugares')
@Controller('api/locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly spacesService: SpacesService,) {}
  // Metodo Post: Para agregar Lugares
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo lugar' })
  @ApiResponse({ status: 201, description: 'El lugar fue creado exitosamente.', type: Location })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({ status: 409, description: 'Conflicto. Ya existe un lugar con ese nombre.' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationsService.create(createLocationDto);
  }

  // Metodo get: Para obtener todos los Lugares
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de todos los lugares' })
  @ApiResponse({ status: 200, description: 'Devuelve un array con todos los lugares.', type: [Location] })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll() {
    return this.locationsService.findAll();
  }

  // Metodo get:id: Para obtener Lugar por Id
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lugar por su ID' })
  @ApiResponse({ status: 200, description: 'Devuelve el lugar solicitado.', type: Location })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    // Llama al método del servicio que busca por ID
    return this.locationsService.findOneById(id);
  }

  // Metodo Patch: Para actualizar el Lugar
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualizar un lugar existente' })
  @ApiResponse({ status: 200, description: 'Devuelve el lugar actualizado.', type: Location })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationsService.update(id, updateLocationDto);
  }

  // Metodo Delete: Para eliminar el Lugar
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un lugar por su ID' })
  @ApiResponse({ status: 204, description: 'El lugar fue eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.locationsService.remove(id);
  }
  // Metodo Post: Para agregar espacio por con Lugar Id
  @Post(':locationId/spaces')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo espacio dentro de un lugar' })
  @ApiResponse({ status: 201, description: 'El espacio fue creado exitosamente.', type: Space })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  createSpace(
    @Param('locationId', ParseMongoIdPipe) locationId: string,
    @Body() createSpaceDto: CreateSpaceDto,
  ) {
    return this.spacesService.create(locationId, createSpaceDto);
  }
  // Metodo Get: Para obtener espacio por con Lugar Id
  @Get(':locationId/spaces')
  @ApiOperation({ summary: 'Obtener los espacios de un lugar específico' })
  @ApiResponse({ status: 200, description: 'Devuelve un array con los espacios del lugar.', type: [Space] })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findSpacesByLocation(
    @Param('locationId', ParseMongoIdPipe) locationId: string,
  ) {
    return this.spacesService.findAllByLocation(locationId);
  }
}
