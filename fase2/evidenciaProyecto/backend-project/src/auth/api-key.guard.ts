import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
// Guard para validar la API Key en las solicitudes entrantes
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  // Método que determina si la solicitud puede proceder
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // Obtener el objeto de la solicitud HTTP
    const apiKeyHeader = request.headers['x-api-key']; // Obtener la API Key del encabezado 'x-api-key'
    // Validar la API Key
    const validApiKey = this.configService.get<string>('API_KEY');
    // Si la API Key es válida, permitir el acceso
    if (apiKeyHeader === validApiKey) {
      return true;
    }
    // Si la API Key no es válida, 401 Unauthorized
    throw new UnauthorizedException('API Key inválida o no proporcionada.');
  }
}

