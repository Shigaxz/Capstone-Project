import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { FindReservationsQueryDto } from './dto/find-reservations-query.dto';

const mockReservationsService = {
  create: jest.fn((dto) => Promise.resolve({ _id: 'reservationId123', ...dto })),
  findAllPending: jest.fn(() => Promise.resolve([{ _id: 'res1', isApproved: null }])),
  findAllHistory: jest.fn(() => Promise.resolve([{ _id: 'res1', isApproved: true }])),
  approve: jest.fn((id) => Promise.resolve({ _id: id, isApproved: true })),
  reject: jest.fn((id) => Promise.resolve({ _id: id, isApproved: false })),
  findAvailabilityBySpace: jest.fn((spaceId, date) => Promise.resolve([])),
  findAll: jest.fn((query) => Promise.resolve([{ _id: 'res1' }])),
  remove: jest.fn(() => Promise.resolve()),
};

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: mockReservationsService,
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', async () => {
    const dto: CreateReservationDto = {
      espacioId: '68f7d322b53a3c0fa899cc81',
      email: 'test@example.com',
      startTime: '2025-10-31T10:00:00.000Z',
      duration: 60,
    };
    await controller.create(dto);
    expect(mockReservationsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAllPending', async () => {
    await controller.findAllPending();
    expect(mockReservationsService.findAllPending).toHaveBeenCalled();
  });

  it('should call findAllHistory', async () => {
    await controller.findAllHistory();
    expect(mockReservationsService.findAllHistory).toHaveBeenCalled();
  });

  it('should call approve', async () => {
    await controller.approve('1');
    expect(mockReservationsService.approve).toHaveBeenCalledWith('1');
  });

  it('should call reject', async () => {
    await controller.reject('1');
    expect(mockReservationsService.reject).toHaveBeenCalledWith('1');
  });

  it('should call findAvailabilityBySpace', async () => {
    const spaceId = '68f7d322b53a3c0fa899cc81';
    const date = '2025-10-31';
    await controller.findAvailability(spaceId, date);
    expect(mockReservationsService.findAvailabilityBySpace).toHaveBeenCalledWith(spaceId, date);
  });

  it('should call findAll', async () => {
    const query: FindReservationsQueryDto = {
      espacioId: '68f7d322b53a3c0fa899cc81',
      date: '2025-10-31',
      isApproved: 'null',
    };
    await controller.findAll(query);
    expect(mockReservationsService.findAll).toHaveBeenCalledWith(query);
  });

  it('should call remove', async () => {
    await controller.remove('1');
    expect(mockReservationsService.remove).toHaveBeenCalledWith('1');
  });
});