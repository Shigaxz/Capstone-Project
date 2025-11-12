import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Back-end Modulo Reservas y Memorias CITT';
  }
}
