import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { SpacesService } from '../spaces/spaces.service'; // Importa el otro servicio
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateSpaceDto } from '../spaces/dto/create-space.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';

// 1. Simula (mockea) el LocationsService
const mockLocationsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOneById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// 2. Simula (mockea) el SpacesService
const mockSpacesService = {
  create: jest.fn(),
  findAllByLocation: jest.fn(),
};

describe('LocationsController', () => {
  let controller: LocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        // 3. Provee el LocationsService simulado
        {
          provide: LocationsService,
          useValue: mockLocationsService,
        },
        // 4. Provee el SpacesService simulado (el controlador también depende de este)
        {
          provide: SpacesService,
          useValue: mockSpacesService,
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
  });

  // 5. Este test ahora funcionará
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Pruebas Adicionales (Opcional pero recomendado) ---

  it('should call locationsService.create', async () => {
    const dto: CreateLocationDto = { name: 'Test', floor: 1 };
    await controller.create(dto);
    expect(mockLocationsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call locationsService.findAll', async () => {
    await controller.findAll();
    expect(mockLocationsService.findAll).toHaveBeenCalled();
  });

  it('should call locationsService.findOneById', async () => {
    await controller.findOne('1');
    expect(mockLocationsService.findOneById).toHaveBeenCalledWith('1');
  });

  it('should call locationsService.update', async () => {
    const dto: UpdateLocationDto = { name: 'Test Updated' };
    await controller.update('1', dto);
    expect(mockLocationsService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call locationsService.remove', async () => {
    await controller.remove('1');
    expect(mockLocationsService.remove).toHaveBeenCalledWith('1');
  });

  it('should call spacesService.createSpace', async () => {
    const dto: CreateSpaceDto = { name: 'Test Space', capacity: 1 };
    await controller.createSpace('locId', dto);
    expect(mockSpacesService.create).toHaveBeenCalledWith('locId', dto);
  });

  it('should call spacesService.findSpacesByLocation', async () => {
    await controller.findSpacesByLocation('locId');
    expect(mockSpacesService.findAllByLocation).toHaveBeenCalledWith('locId');
  });
});