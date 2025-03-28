import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly orderService: OrdersService
    ) {};
    @Post()
    createOrder(@Request() req) {
        return this.orderService.createOrder(req.user.id);
    }   
    
}
