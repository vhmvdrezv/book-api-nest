import { Body, Controller, Get, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { };

    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }

    @Post()
    async createBook(@Body() createBookDto: CreateBookDto) {
        
    }
}
