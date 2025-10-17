import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Space } from './schemas/space.schema';

@ApiHeader({ 
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@ApiTags('Espacios')
@Controller('api/spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  // Metodo get: Para obtener todos los espacios
  @Get()
  @ApiOperation({ summary: 'Obtener una lista de todos los espacios' })
  @ApiResponse({ status: 200, description: 'Devuelve un array con todos los espacios.', type: [Space] })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findAll() {
    return this.spacesService.findAll();
  }

  // Metodo get:id: Para obtener el Lugar por Id
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un espacio por su ID' })
  @ApiResponse({ status: 200, description: 'Devuelve el espacio solicitado.', type: Space })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.spacesService.findOne(id);
  }

  // Metodo Patch: Para actualizar el Lugar por Id
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un espacio existente' })
  @ApiResponse({ status: 200, description: 'Devuelve el espacio actualizado.', type: Space })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  // Metodo Delete: Para borrrar el Lugar por Id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un espacio por su ID' })
  @ApiResponse({ status: 204, description: 'El espacio fue eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.spacesService.remove(id);
  }
}