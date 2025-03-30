import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
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
    getMyOrders(@Request() req,@Body() getOrdersDto: GetOrdersDto) {
        return this.orderService.getMyOrders(req.user.id, getOrdersDto);
    }

    @Get(':id')
    async getOrderById(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.orderService.getMyOrderById(req.user.id, id);
    }

    @Patch(':id/cancel')
    async cancelOrder(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.orderService.cancelOrder(req.user.id, id);
    }
    
}
