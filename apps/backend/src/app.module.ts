import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { BalancesModule } from './modules/balances/balances.module';
import { SeedModule } from './modules/seed/seed.module';
import { User } from './modules/users/entities/user.entity';
import { Group } from './modules/groups/entities/group.entity';
import { GroupMember } from './modules/groups/entities/group-member.entity';
import { Expense } from './modules/expenses/entities/expense.entity';
import { ExpenseSplit } from './modules/expenses/entities/expense-split.entity';
import { Settlement } from './modules/balances/entities/settlement.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'amigouser'),
        password: configService.get<string>('DB_PASSWORD', 'amigopassword'),
        database: configService.get<string>('DB_NAME', 'amigogasto_db'),
        entities: [User, Group, GroupMember, Expense, ExpenseSplit, Settlement],
        synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    GroupsModule,
    ExpensesModule,
    BalancesModule,
    SeedModule,
  ],
})
export class AppModule {}
