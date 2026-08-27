import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Inicialización y Demo')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Cargar datos demo (Usuarios, Grupos de Viajes/Casas y Gastos con Splits)' })
  @ApiResponse({ status: 201, description: 'Datos semilla insertados correctamente' })
  runSeed() {
    return this.seedService.runSeed();
  }
}
