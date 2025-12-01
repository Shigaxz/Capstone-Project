import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginDto } from './dto/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

// Mock de los datos que esperamos de la BD
const mockAdmin = {
  _id: 'some-id-123',
  user: 'testadmin',
  email: 'test@duocuc.cl',
  password: 'hashedPassword123',
};

// Mock de la función save()
const mockSave = jest.fn().mockResolvedValue(mockAdmin);

// Mock de la clase del Modelo Mongoose
class MockAdminModel {
  // Simula el constructor
  constructor(public data: any) {}
  
  // Simula el método de instancia .save()
  save = mockSave;

  // Simula el método estático .findOne()
  static findOne = jest.fn();
  // Simula el método estático .exec() (encadenado)
  static exec = jest.fn();
}

// Mock del JwtService
const mockJwtService = {
  sign: jest.fn(() => 'test-jwt-token'),
};

describe('AdminService', () => {
  let service: AdminService;
  let model: typeof MockAdminModel;
  let jwtService: JwtService;

  // Esto se ejecuta antes de CADA prueba
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          // Provee el "AdminModel"
          provide: getModelToken(Admin.name),
          useValue: MockAdminModel, // Usa nuestra clase Mock
        },
        {
          // Provee el "JwtService"
          provide: JwtService,
          useValue: mockJwtService, // Usa nuestro objeto Mock
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    jwtService = module.get<JwtService>(JwtService);
    // Asignamos el mock a 'model' para poder espiar sus métodos estáticos
    model = module.get<typeof MockAdminModel>(getModelToken(Admin.name));

    // Espiamos bcrypt. Lo necesitamos porque se importa globalmente
    // y no se inyecta
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123' as never);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('register', () => {
    const createAdminDto: CreateAdminDto = {
      user: 'newadmin',
      email: 'new@duocuc.cl',
      password: 'password123',
    };

    it('should register a new admin successfully', async () => {
      // Configuración: findOne no encuentra nada (null)
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);

      const result = await service.register(createAdminDto);

      // Afirmaciones (Asserts)
      expect(model.findOne).toHaveBeenCalledWith({
        $or: [{ email: createAdminDto.email }, { user: createAdminDto.user }],
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createAdminDto.password, 10);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Administrador registrado exitosamente' });
    });

    it('should throw a ConflictException if email already exists', async () => {
      // Configuración: findOne SÍ encuentra un admin
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockAdmin) } as any);

      // Afirmación: Esperamos que la promesa sea rechazada y lance ConflictException
      await expect(service.register(createAdminDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(createAdminDto)).rejects.toThrow(
        'El email o el usuario ya están registrados',
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@duocuc.cl',
      password: 'password123',
    };

    it('should return an access token for valid credentials', async () => {
      // Configuración: findOne encuentra al admin y bcrypt.compare es true
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockAdmin) } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      // Afirmaciones
      expect(model.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockAdmin.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockAdmin.email,
        sub: mockAdmin._id,
        user: mockAdmin.user,
      });
      expect(result).toEqual({ accessToken: 'test-jwt-token' });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      // Configuración: findOne no encuentra nada (null)
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);

      // Afirmación
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciales inválidas',
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Configuración: findOne encuentra al admin, pero bcrypt.compare es false
      model.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockAdmin) } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      // Afirmación
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Credenciales inválidas',
      );
    });
  });
});