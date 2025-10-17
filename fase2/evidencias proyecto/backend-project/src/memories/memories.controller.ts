import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { S3File } from '../common/interfaces/s3-file.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiHeader } from '@nestjs/swagger';
import { Memory } from './schemas/memory.schema';

@ApiHeader({ 
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@ApiTags('Memorias')
@Controller('api/memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  // Metodo Post: Para agregar Memorias
  @Post()
  @ApiOperation({ summary: 'Crear una nueva memoria' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de la memoria y archivos de imagen',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Mi Prototipo' },
        members: { type: 'array', items: { type: 'string' }, example: ['Juan Pérez'] },
        teacher: { type: 'string', example: 'Prof. Ana Torres' },
        company: { type: 'string', example: 'Empresa XYZ' },
        year: { type: 'number', example: 2025 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary', 
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'La memoria fue creada exitosamente.',
    type: Memory,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado (Forbidden).' })
  @UseInterceptors(FilesInterceptor('images', 10))
  create(
    @UploadedFiles() files: Array<S3File>,
    @Body() createMemoryDto: CreateMemoryDto,
  ) {
    if (!files || files.length === 0) {
      // Opcional: Manejar el caso de que no se suban imágenes
    }
    return this.memoriesService.create(createMemoryDto, files);
  }

  // Metodo get: Para obtener Memorias
  @Get()
  @ApiOperation({ summary: 'Obtiene un array de memorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las memorias.',
    type: [Memory],
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado (Forbidden).' })
  findAll() {
    return this.memoriesService.findAll();
  }
  // Metodo get:id: Para una memoria en especifico
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una memoria con el id' })
  @ApiResponse({ status: 200, description: 'Devuelve la memoria solicitada.', type: Memory })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.memoriesService.findOne(id);
  }

  // Metodo patch: Para actualizar una memoria
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una memoria con el id' })
  @ApiResponse({ status: 200, description: 'Devuelve la memoria actualizada.', type: Memory })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateMemoryDto: UpdateMemoryDto,
  ) {
    return this.memoriesService.update(id, updateMemoryDto);
  }

  // Metodo delete: Para borrar una memoria
  @Delete(':id')
  @ApiOperation({ summary: 'Borra una memoria con el id' })
  @ApiResponse({ status: 204, description: 'La memoria fue eliminada exitosamente. No hay contenido de respuesta.' })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.memoriesService.remove(id);
  }
}
