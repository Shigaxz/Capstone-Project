import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AdminService {
    constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}
  // Registro de un nuevo administrador
  async register(createAdminDto: CreateAdminDto): Promise<{ message: string }> {
    const { email, user, password } = createAdminDto; // Desestructurar los datos del DTO
    // Verificar si el email o usuario ya existen
    const existingAdmin = await this.adminModel.findOne({ $or: [{ email }, { user }] }).exec();
    if (existingAdmin) {
      throw new ConflictException('El email o el usuario ya están registrados');
    }
    // Encriptar la contraseña usando bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear un nuevo administrador
    const newAdmin = new this.adminModel({
      email,
      user,
      password: hashedPassword,
    });
    // Guardar el administrador en la base de datos
    await newAdmin.save();
    return { message: 'Administrador registrado exitosamente' };
  }
  // Login de un administrador
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto; // Desestructurar los datos del DTO
    // Buscar el administrador por email
    const admin = await this.adminModel.findOne({ email }).exec();
    // Si no existe, lanza una excepción
    if (!admin) {
      // 401 Unauthorized
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // Verifica la contraseña
    const isPasswordMatching = await bcrypt.compare(password, admin.password);
    // Si la contraseña no coincide, lanza una excepción
    if (!isPasswordMatching) {
      // 401 Unauthorized
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // Genera el payload con los datos
    const payload = { email: admin.email, sub: admin._id, user: admin.user };
    // Genera el token JWT
    const accessToken = this.jwtService.sign(payload);
    // Devuelve el token
    return { accessToken };
  }
}

