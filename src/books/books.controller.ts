import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { };

    @Get()
    async getAllBooks() {
        return this.booksService.getAllBooks();
    }

    @Get(':id')
    async getOneBook(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.getOneBook(id);
    }

    @Post()
    async createBook(@Body() createBookDto: CreateBookDto) {
        return this.booksService.createBook(createBookDto);
    }


}
