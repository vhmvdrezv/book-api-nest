import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dto/get-orders.dto';

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

    @Get()
    getOrders(@Request() req,@Body() getOrdersDto: GetOrdersDto) {
        return this.orderService.getOrders(req.user.id, getOrdersDto);
    }
    
}
