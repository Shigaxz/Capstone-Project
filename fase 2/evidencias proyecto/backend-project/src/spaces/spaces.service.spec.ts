import { Test, TestingModule } from '@nestjs/testing';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

// 1. Simula (mockea) el SpacesService
const mockSpacesService = {
  findAll: jest.fn(() => Promise.resolve([])),
  findOne: jest.fn((id) => Promise.resolve({ _id: id, name: 'Test Space' })),
  update: jest.fn((id, dto) => Promise.resolve({ _id: id, ...dto })),
  remove: jest.fn(() => Promise.resolve()),
  create: jest.fn(),
  findAllByLocation: jest.fn(),
};

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        // 2. Provee el servicio simulado en lugar del real
        {
          provide: SpacesService,
          useValue: mockSpacesService,
        },
      ],
    }).compile();

    controller = module.get<SpacesController>(SpacesController);
    service = module.get<SpacesService>(SpacesService);
  });

  // 3. Este test ahora funcionará
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Pruebas Adicionales (Opcional pero recomendado) ---

  it('should call findAll', async () => {
    await controller.findAll();
    expect(mockSpacesService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', async () => {
    await controller.findOne('1');
    expect(mockSpacesService.findOne).toHaveBeenCalledWith('1');
  });

  it('should call update', async () => {
    const dto: UpdateSpaceDto = { name: 'Test Updated' };
    await controller.update('1', dto);
    expect(mockSpacesService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call remove', async () => {
    await controller.remove('1');
    expect(mockSpacesService.remove).toHaveBeenCalledWith('1');
  });
});