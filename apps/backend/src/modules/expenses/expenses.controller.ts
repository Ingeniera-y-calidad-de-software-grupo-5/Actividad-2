import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './entities/expense.entity';

@ApiTags('Gastos')
@Controller('groups/:groupId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo gasto en un grupo y asignar splits' })
  @ApiResponse({ status: 201, description: 'Gasto registrado correctamente', type: Expense })
  create(
    @Param('groupId') groupId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.create(groupId, createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los gastos de un grupo con sus participantes y splits' })
  @ApiResponse({ status: 200, description: 'Listado de gastos del grupo', type: [Expense] })
  findByGroup(@Param('groupId') groupId: string): Promise<Expense[]> {
    return this.expensesService.findByGroup(groupId);
  }

  @Delete(':expenseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un gasto registrado' })
  @ApiResponse({ status: 204, description: 'Gasto eliminado' })
  remove(
    @Param('groupId') groupId: string,
    @Param('expenseId') expenseId: string,
  ): Promise<void> {
    return this.expensesService.remove(groupId, expenseId);
  }
}
