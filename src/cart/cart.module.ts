import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [DatabaseModule]
})
export class CartModule {}
