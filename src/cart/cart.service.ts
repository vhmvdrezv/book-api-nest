import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddBookToCartDto } from './dto/add-book-to-cart.dto';
import { DatabaseService } from 'src/database/database.service';
import { BookStatus } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(
        private readonly databaseService: DatabaseService
    ) { }

    async getMyCart(userId: number) {
        const cart = await this.databaseService.cart.findUnique({
            where: {
                userId
            },
            include: {
                books: {
                    include: {
                        book: true
                    },
                }
            },
            
        });

        if (!cart) {
            throw new NotFoundException(`Cart for user with id ${userId} not found`);
        }

        return {
            status: 'success',
            message: 'Cart retrieved successfully',
            data: {
                userId: cart.userId,
                books: cart.books.map(item => ({
                  bookId: item.book.id,
                  title: item.book.title,
                  price: item.book.price,
                  quantity: item.quantity,
            })),
        }}
    }

    async addBookToCart(userId: number, addBookToCartDto: AddBookToCartDto) {
        const { bookId } = addBookToCartDto;

        const book = await this.databaseService.book.findUnique({ where: { id: bookId } });
        if (!book) throw new NotFoundException(`book with id ${bookId} not found`);
        if (book.status !== BookStatus.ACTIVE) throw new BadRequestException(`book is not available`);
        if (book.stock < 1) throw new BadRequestException(`Book with id ${bookId} is out of stock`);
        
        const cartExists = await this.databaseService.cart.findUnique({ where: { userId } });
        if (!cartExists) await this.databaseService.cart.create({ data: { userId } });

        
        await this.databaseService.cartBook.upsert({
            where: { cartId_bookId: { cartId: userId, bookId } },
            update: { quantity: { increment: 1 } },
            create: {
                cartId: userId,
                bookId,
                quantity: 1
            } 
        });
        
        return {
            status: 'success',
            message: 'Book added to cart successfully',
        };
    }
}
