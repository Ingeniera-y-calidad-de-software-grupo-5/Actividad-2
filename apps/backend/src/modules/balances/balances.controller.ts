import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BalancesService } from './balances.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { GroupBalanceSummaryDto } from './dto/balance-summary.dto';
import { Settlement } from './entities/settlement.entity';

@ApiTags('Balances y Liquidación')
@Controller('groups/:groupId')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get('balances')
  @ApiOperation({
    summary: 'Obtener resumen de balances netos y sugerencias óptimas de liquidación (Min Cash Flow)',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen de balances y transferencias mínimas sugeridas',
    type: GroupBalanceSummaryDto,
  })
  getBalances(@Param('groupId') groupId: string): Promise<GroupBalanceSummaryDto> {
    return this.balancesService.getGroupBalances(groupId);
  }

  @Post('settlements')
  @ApiOperation({ summary: 'Registrar un pago de liquidación entre dos miembros' })
  @ApiResponse({ status: 201, description: 'Liquidación registrada con éxito', type: Settlement })
  createSettlement(
    @Param('groupId') groupId: string,
    @Body() createSettlementDto: CreateSettlementDto,
  ): Promise<Settlement> {
    return this.balancesService.createSettlement(groupId, createSettlementDto);
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Listar historial de pagos de liquidación del grupo' })
  @ApiResponse({ status: 200, description: 'Historial de pagos de liquidación', type: [Settlement] })
  getSettlements(@Param('groupId') groupId: string): Promise<Settlement[]> {
    return this.balancesService.getSettlementsByGroup(groupId);
  }
}
