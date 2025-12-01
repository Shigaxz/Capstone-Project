import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({ description: 'Username del administrador', example: 'sb-admin' })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Correo electrónico para iniciar sesión', example: 'admin@duocuc.cl' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña con un mínimo de 8 caracteres', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
