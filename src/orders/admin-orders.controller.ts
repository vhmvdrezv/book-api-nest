import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetAdminOrdersDto } from './dto/get-admin-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('admin/orders')
// This controller is for admin purposes, so it should be protected by an admin guard
export class AdminOrdersController {
    constructor(
        private readonly ordersService: OrdersService
    ) {};

    @Get()
    async getAllOrders(@Query() getAdminOrdersDto: GetAdminOrdersDto) {
        return this.ordersService.getAllOrders(getAdminOrdersDto);
    }

    @Get(':id')
    async getOrderById(@Param('id', ParseIntPipe) id: number) {
        return this.ordersService.getOrderById(id);
    }

    @Patch(':id')
    async updateOrder(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
        return this.ordersService.updateOrder(id, updateOrderDto);
    }
}
