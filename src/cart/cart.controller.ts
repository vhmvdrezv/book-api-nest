import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AddBookToCartDto } from './dto/add-book-to-cart.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CartService } from './cart.service';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Post('books')
    async addBookToCart(@Request() req, @Body() addBookToCartDto: AddBookToCartDto) {
        return this.cartService.addBookToCart(req.user.id, addBookToCartDto)
    }   

    @Get()
    async getMyCart(@Request() req) {
        return this.cartService.getMyCart(req.user.id)
    }

    @Delete('books/:bookId')
    async deleteBookFromCart(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
        return this.cartService.deleteBookFromCart(req.user.id, bookId);
    }
}
