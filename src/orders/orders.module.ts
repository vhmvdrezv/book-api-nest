import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseModule } from 'src/database/database.module';
import { AdminOrdersController } from './admin-orders.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
