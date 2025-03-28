import { BadRequestException, Injectable } from '@nestjs/common';
import { BookStatus, OrderStatus } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { GetOrdersDto } from './dto/get-orders.dto';

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

    async getOrders(userId: number, getOrdersDto: GetOrdersDto) {
        const { page = 1, limit = 5 } = getOrdersDto;

        const orders = await this.databaseService.order.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                userId: true,
                orderDate: true,
                status: true,
                totalPrice: true,
                orderBook: {
                    select: {
                        bookId: true,
                        book: {
                            select: {
                                id: true,
                                title: true,
                            }
                        }
                    }
                }
            },
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
}
