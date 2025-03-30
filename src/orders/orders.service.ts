import { BadRequestException, Injectable } from '@nestjs/common';
import { BookStatus, OrderStatus } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { GetOrdersDto } from './dto/get-orders.dto';
import { orderSelectFields } from './constants';
import { GetAdminOrdersDto } from './dto/get-admin-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly databaseService: DatabaseService) { }
    async createOrder(userId: number) {
        const cartBooks = await this.databaseService.cartBook.findMany({
            where: { cartId: userId },
            include: { book: true },
        });

        // If cart is empty, return an error
        if (cartBooks.length === 0) {
            throw new BadRequestException("Your cart is empty.");
        }

        // Check if all books are active
        cartBooks.forEach(({ book }) => {
            if (book.status === BookStatus.INACTIVE) {
                throw new BadRequestException(`Book ${book.title} is inactive`);
            }
        });

        // Check stock availability
        cartBooks.forEach(({ book, quantity }) => {
            if (book.stock < quantity) {
                throw new BadRequestException(`Book ${book.title} is out of stock`);
            }
        });

        // Calculate total price
        const totalPrice = cartBooks.reduce((sum, { book, quantity }) => {
            return sum + book.price * quantity;
        }, 0);

        return await this.databaseService.$transaction(async (tx) => {

            const order = await tx.order.create({
                data: {
                    userId,
                    totalPrice,
                    status: OrderStatus.PENDING,
                    orderBook: {
                        create: cartBooks.map(({ bookId, quantity }) => ({ bookId, quantity }))
                    }
                }
            });

            // Update book stock and status
            await Promise.all(
                cartBooks.map(({ bookId, quantity }) =>
                    tx.book.update({
                        where: { id: bookId },
                        data: { stock: { decrement: quantity } },
                    })
                )
            );

            // Delete cart books
            await tx.cartBook.deleteMany({
                where: { cartId: userId }
            });

            await tx.cart.delete({
                where: { userId }
            });

            return {
                status:'success',
                message: 'Order created successfully.',
                data: order
            }
        });
    }

    async getMyOrders(userId: number, getOrdersDto: GetOrdersDto) {
        const { page = 1, limit = 5 } = getOrdersDto;

        const orders = await this.databaseService.order.findMany({
            where: {
                userId
            },
            select: orderSelectFields,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { orderDate: 'desc' }
        });

        const totalOrders = await this.databaseService.order.count({
            where: { userId }
        });
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            status: 'success',
            message: 'Orders retrieved successfully',
            data: orders,
            nextPage: page < totalPages,
            prevPage: page > 1
        }
    }
    async getMyOrderById(userId: number, orderId: number) {
        const order = await this.databaseService.order.findUnique({
            where: {
                id: orderId,
            },
            select: orderSelectFields
        });


        if (!order) throw new BadRequestException(`Order with ID ${orderId} not found`);

        if(order.userId !== userId) throw new BadRequestException(`Order with ID ${orderId} does not belong to you`);

        return {
            status: 'success',
            message: 'Order retrieved successfully',
            data: order
        }
    }

    async cancelOrder(userId: number, orderId: number) {
        const order = await this.databaseService.order.findUnique({
            where: { id: orderId },
            include: { orderBook: true },
        });

        if (!order) throw new BadRequestException(`Order with ID ${orderId} not found`);

        if(order.userId !== userId) throw new BadRequestException(`Order with ID ${orderId} does not belong to you`);

        if(order.status !== OrderStatus.PENDING) throw new BadRequestException(`Order with ID ${orderId} cannot be cancelled`);

        return await this.databaseService.$transaction(async (tx) => {
            // Update book stock and status
            await Promise.all(
                order.orderBook.map(({ bookId, quantity }) =>
                    tx.book.update({
                        where: { id: bookId },
                        data: { stock: { increment: quantity } },
                    })
                )
            );

            // Update order status to cancelled
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: OrderStatus.CANCELLED },
            });

            return {
                status: 'success',
                message: 'Order cancelled successfully',
                data: updatedOrder
            }
        });
    }

    async getAllOrders(getAdminOrdersDto: GetAdminOrdersDto) {
        const { page = 1, limit = 5, status } = getAdminOrdersDto;

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const orders = await this.databaseService.order.findMany({
            where,
            select: orderSelectFields,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { orderDate: 'desc' }
        });

        const totalOrders = await this.databaseService.order.count({
            where
        });
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            status: 'success',
            message: 'Orders retrieved successfully',
            data: orders,
            nextPage: page < totalPages,
            prevPage: page > 1
        }
    }

    async getOrderById(id: number) {
        const select: any = orderSelectFields;
        select.user = {
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
            }
        };

        const order = await this.databaseService.order.findUnique({
            where: { id },
            select
        });
        if (!order) throw new BadRequestException(`Order with ID ${id} not found`);
        return {
            status: 'success',
            message: 'Order retrieved successfully',
            data: order
        }
    }

    async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
        const order = await this.databaseService.order.findUnique({
            where: { id },
        });
        if (!order) throw new BadRequestException(`Order with ID ${id} not found`);

        const updatedOrder = await this.databaseService.order.update({
            where: { id },
            data: {
                status: updateOrderDto.status,
            }
        });

        return {
            status: 'success',
            message: 'Order updated successfully',
            data: updatedOrder
        }
    }
}
