import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiHeader } from '@nestjs/swagger';

@ApiTags('Index')
@ApiHeader({ 
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Back-end de sistema de memorias y reservas CITT' })
  getHello(): string {
    return this.appService.getHello();
  }
}
