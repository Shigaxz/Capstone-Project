import { Test, TestingModule } from '@nestjs/testing';
import { MemoriesController } from './memories.controller';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { Response } from 'express';
import { StreamableFile } from '@nestjs/common';

// 1. Simula (mockea) el MemoriesService
// No nos importa qué hace, solo que el controlador lo pueda llamar.
const mockMemoriesService = {
  create: jest.fn((dto) => Promise.resolve({ _id: 'memId123', ...dto })),
  findAll: jest.fn(() => Promise.resolve([{ _id: 'memId123', title: 'Test' }])),
  findOne: jest.fn((id) => Promise.resolve({ _id: id, title: 'Test' })),
  update: jest.fn((id, dto) => Promise.resolve({ _id: id, ...dto })),
  remove: jest.fn(() => Promise.resolve()),
  generateMemoryPDF: jest.fn((id) => Promise.resolve(Buffer.from('fake-pdf'))),
};

describe('MemoriesController', () => {
  let controller: MemoriesController;
  let service: MemoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemoriesController],
      providers: [
        // 2. Provee el servicio simulado en lugar del real
        {
          provide: MemoriesService,
          useValue: mockMemoriesService,
        },
      ],
    }).compile();

    controller = module.get<MemoriesController>(MemoriesController);
    service = module.get<MemoriesService>(MemoriesService);
  });

  // 3. Este test ahora funcionará
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Pruebas Adicionales (Opcional pero recomendado) ---

  it('should create a memory', async () => {
    const dto: CreateMemoryDto = {
      title: 'Test',
      members: ['Test'],
      teacher: 'Test',
      description: 'Test',
      year: 2025,
    };
    await controller.create(dto);
    expect(mockMemoriesService.create).toHaveBeenCalledWith(dto);
  });

  it('should find all memories', async () => {
    await controller.findAll();
    expect(mockMemoriesService.findAll).toHaveBeenCalled();
  });

  it('should find one memory by id', async () => {
    await controller.findOne('1');
    expect(mockMemoriesService.findOne).toHaveBeenCalledWith('1');
  });

  it('should update a memory', async () => {
    const dto: UpdateMemoryDto = { title: 'Test Updated' };
    await controller.update('1', dto);
    expect(mockMemoriesService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove a memory', async () => {
    await controller.remove('1');
    expect(mockMemoriesService.remove).toHaveBeenCalledWith('1');
  });

 it('should generate a PDF', async () => {
    const mockResponse = {
      setHeader: jest.fn().mockReturnThis(),
    } as unknown as Response;

    const result = await controller.getMemoryAsPDF('1', mockResponse);

    expect(mockMemoriesService.generateMemoryPDF).toHaveBeenCalledWith('1');
    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'Content-Disposition', 
      'attachment; filename=memoria-1.pdf'
    );
    expect(result).toBeInstanceOf(StreamableFile);
  });
});