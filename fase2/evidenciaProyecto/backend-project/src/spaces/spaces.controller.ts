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

@Controller('api/spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  // Metodo get: Para obtener todos los espacios
  @Get()
  findAll() {
    return this.spacesService.findAll();
  }

  // Metodo get:id: Para obtener el Lugar por Id
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.spacesService.findOne(id);
  }

  // Metodo Patch: Para actualizar el Lugar por Id
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  // Metodo Delete: Para borrrar el Lugar por Id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.spacesService.remove(id);
  }
}