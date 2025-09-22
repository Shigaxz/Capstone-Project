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

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
// Metodo para registrar un nuevo administrador
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Valida y limpia el DTO
  async register(@Body() createAdminDto: CreateAdminDto) { // Funcion Register del servicio
    return this.adminService.register(createAdminDto);
  }
// Metodo para que un administrador inicie sesión
  @Post('login')
  @HttpCode(HttpStatus.OK) // Asegura que la respuesta tenga el código 200 OK
  @UsePipes(new ValidationPipe({ whitelist: true })) // Valida y limpia el DTO
  async login(@Body() loginDto: LoginDto) { // Funcion Login del servicio
    return this.adminService.login(loginDto);
  }
}
