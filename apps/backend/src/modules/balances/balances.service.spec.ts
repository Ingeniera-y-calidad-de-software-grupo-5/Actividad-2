import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BalancesService } from './balances.service';
import { Settlement } from './entities/settlement.entity';
import { Group } from '../groups/entities/group.entity';
import { User } from '../users/entities/user.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { ExpenseSplit } from '../expenses/entities/expense-split.entity';

describe('BalancesService & Min Cash Flow Algorithm', () => {
  let service: BalancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BalancesService,
        {
          provide: getRepositoryToken(Settlement),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockImplementation((dto) => dto),
            save: jest.fn().mockImplementation((s) => Promise.resolve({ id: 'uuid-st', ...s })),
          },
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Expense),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ExpenseSplit),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BalancesService>(BalancesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe simplificar correctamente las deudas entre 3 usuarios (Min Cash Flow)', () => {
    const userA = { id: '1', name: 'Santiago' } as User;
    const userB = { id: '2', name: 'Martina' } as User;
    const userC = { id: '3', name: 'Lucas' } as User;

    // Supongamos que:
    // Santiago tiene balance neto +$60 (acreedor)
    // Martina tiene balance neto -$40 (deudor)
    // Lucas tiene balance neto -$20 (deudor)
    const mockBalances = [
      {
        user: userA,
        totalPaid: 100,
        totalOwed: 40,
        settlementsPaid: 0,
        settlementsReceived: 0,
        netBalance: 60,
      },
      {
        user: userB,
        totalPaid: 0,
        totalOwed: 40,
        settlementsPaid: 0,
        settlementsReceived: 0,
        netBalance: -40,
      },
      {
        user: userC,
        totalPaid: 0,
        totalOwed: 20,
        settlementsPaid: 0,
        settlementsReceived: 0,
        netBalance: -20,
      },
    ];

    // Acceder al método privado de simplificación mediante casting
    const suggestions = (service as any).calculateSimplifiedDebts(mockBalances);

    expect(suggestions.length).toBe(2);
    // Martina le paga 40 a Santiago
    // Lucas le paga 20 a Santiago
    const totalTransfer = suggestions.reduce((sum: number, s: any) => sum + s.amount, 0);
    expect(totalTransfer).toBe(60);
  });
});
