import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AddBookWriterDto } from './dto/add-book-writer.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { };

    @Get()
    async getAllBooks(@Query() filterBooksDto: FilterBooksDto) {
        return this.booksService.getAllBooks(filterBooksDto);
    }

    @Get(':id')
    async getOneBook(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.getOneBook(id);
    }

    @Post()
    async createBook(@Body() createBookDto: CreateBookDto) {
        return this.booksService.createBook(createBookDto);
    }

    @Patch(':id')
    async updateBook(@Param('id', ParseIntPipe) id: number, @Body() updateBookDto: UpdateBookDto) {
        return this.booksService.updateBook(id, updateBookDto);
    }

    @Post(':bookId/writers')
    async addBookWriter(@Param('bookId', ParseIntPipe) bookId: number, @Body() addBookWriterDto: AddBookWriterDto) {
        return this.booksService.addBookWriter(bookId, addBookWriterDto);
    }

    @Get(':bookId/writers')
    async getBookWriters(@Param('bookId', ParseIntPipe) bookId: number) {
        return this.booksService.getBookWriters(bookId);
    }

    @Delete(':bookId/writers/:writerId')
    async deleteBookWriter(@Param('bookId', ParseIntPipe) bookId: number, @Param('writerId', ParseIntPipe) writerId: number) {
        return this.booksService.deleteBookWriter(bookId, writerId);
    }

}
