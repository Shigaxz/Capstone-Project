import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { Memory } from './schemas/memory.schema';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crear una nueva memoria (con URLs)' })
  @ApiResponse({
    status: 201,
    description: 'La memoria fue creada exitosamente.',
    type: Memory,
  })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos (ej. URL mal formada).',
  })
  create(@Body() createMemoryDto: CreateMemoryDto) {
    return this.memoriesService.create(createMemoryDto);
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
  @ApiResponse({
    status: 200,
    description: 'Devuelve la memoria solicitada.',
    type: Memory,
  })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.memoriesService.findOne(id);
  }

  // Metodo patch: Para actualizar una memoria
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Actualiza una memoria con el id' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la memoria actualizada.',
    type: Memory,
  })
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
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Borra una memoria con el id' })
  @ApiResponse({
    status: 204,
    description:
      'La memoria fue eliminada exitosamente. No hay contenido de respuesta.',
  })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.memoriesService.remove(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generar un PDF de una memoria' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el archivo PDF de la memoria.',
  })
  @ApiResponse({ status: 404, description: 'Memoria no encontrada.' })
  async getMemoryAsPDF(
    @Param('id', ParseMongoIdPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const pdfBuffer = await this.memoriesService.generateMemoryPDF(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=memoria-${id}.pdf`,
    );

    return new StreamableFile(pdfBuffer);
  }
}
