import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { Admin } from './schemas/admin.schema';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiHeader({ 
  name: 'x-api-key',
  description: 'Clave de API para autorización de la solicitud',
  required: true,
})
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
// Metodo para registrar un nuevo administrador
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo administrador' })
  @ApiResponse({ status: 201, description: 'Administrador registrado exitosamente. No se devuelve la contraseña.', type: Admin })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 409, description: 'Conflicto. El correo ya está en uso.' })
  @UsePipes(new ValidationPipe({ whitelist: true })) // Valida y limpia el DTO
  async register(@Body() createAdminDto: CreateAdminDto) { // Funcion Register del servicio
    return this.adminService.register(createAdminDto);
  }
// Metodo para que un administrador inicie sesión
  @Post('login')
  @HttpCode(HttpStatus.OK) // Asegura que la respuesta tenga el código 200 OK
  @ApiOperation({ summary: 'Iniciar sesión como administrador' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'No autorizado. Credenciales incorrectas.' })
  @UsePipes(new ValidationPipe({ whitelist: true })) // Valida y limpia el DTO
  async login(@Body() loginDto: LoginDto) { // Funcion Login del servicio
    return this.adminService.login(loginDto);
  }
}
