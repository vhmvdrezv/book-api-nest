import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookGenre, BookStatus } from '@prisma/client';
import { UpdateBookDto } from './dto/update-book.dto';
import { AddBookWriterDto } from './dto/add-book-writer.dto';
import { FilterBooksDto } from './dto/filter-books.dto';
import { contains } from 'class-validator';

@Injectable()
export class BooksService {
    constructor(private readonly databaseService: DatabaseService) { };
   
    async getAllBooks(filterBooksDto: FilterBooksDto) {
        const { search, genre } = filterBooksDto;

        const where: { title?: { contains: string }, genre?: BookGenre } = { };

        if (search) {
            where.title = { contains:  search }
        } else {
            where.genre = genre
        }

        const books = await this.databaseService.book.findMany({
            where
        });

        return {
            status: 'success',
            message: 'list of books:',
            data: books
        }
    }

    async createBook(createBookDto: CreateBookDto) {
        const { title, price, stock, genre, writerIds, status } = createBookDto;

        const writers = await this.databaseService.writer.findMany({
            where: {
                id: {
                    in: writerIds
                }
            },
            select: {
                id: true
            }
        });

        if (writers.length !== writerIds.length) {
            throw new BadRequestException('Some writer Ids dont exist');
        }

        return await this.databaseService.$transaction(async (tx) => {
            const newBook = await tx.book.create({
                data: {
                    title,
                    price,
                    stock,
                    genre,
                    status
                }
            });

            await tx.writerBook.createMany({
                data: writerIds.map((writerId) => ({ bookId: newBook.id, writerId}))
            })

            return {
                status: 'success',
                message: 'book created successfully.',
                data: newBook
            }
        });
    }

    async getOneBook(id: number) {
        const book = await this.databaseService.book.findUnique({ where: { id } });

        if (!book) throw new NotFoundException(`book with id ${id} not found.`);

        return{
            status: 'success',
            message: `book with id ${id}:`,
            data: book
        }
    }

    async updateBook(id: number, updateBookDto: UpdateBookDto) {
        const book = await this.databaseService.book.findUnique({ where: { id } });
        if (!book) throw new NotFoundException(`book with id ${id} not found`);

        const updatedBook = await this.databaseService.book.update({
            where: {
                id
            },
            data: updateBookDto
        });

        return {
            status: 'success',
            message: `book with id ${id} updated successfully`,
            data: updatedBook
        };
    }

    async addBookWriter(bookId: number, addBookWriterDto: AddBookWriterDto) {
        const { writerId } = addBookWriterDto;

        const book = await this.databaseService.book.findUnique({
            where: {
                id: bookId
            }
        });

        if (!book) throw new NotFoundException(`book with id ${bookId} not found.`);

        const writer = await this.databaseService.writer.findUnique({
            where: {
                id: writerId
            }
        });

        if (!writer) throw new NotFoundException(`writer with id ${writerId}`);

        const bookWriter = await this.databaseService.writerBook.findUnique({
            where: {
                writerId_bookId: { writerId, bookId }
            }
        });

        if (bookWriter) throw new ConflictException('writer already was added to book');

        await this.databaseService.writerBook.create({
            data: {
                bookId,
                writerId,
            }
        });

        return {
            status: 'success',
            message: 'writer added to book successfully'
        };
    }

    async getBookWriters(bookId: number) {
        const book = await this.databaseService.book.findUnique({
            where: {
                id: bookId
            }
        });

        if (!book) throw new NotFoundException(`book with id ${bookId} not found`);

        const bookWriters = await this.databaseService.writerBook.findMany({
            where: {
                bookId
            }
        });

        const writerIds = bookWriters.map((writer) => writer.writerId);
        
        const writers = await this.databaseService.writer.findMany({
            where: {
                id: { in: writerIds}
            }
        })

        return {
            status: 'success',
            message: 'list of writers of book: ',
            data: writers
        }
    }

    async deleteBookWriter(bookId: number, writerId: number) {
        const book = await this.databaseService.book.findUnique({
            where: {
                id: bookId
            }
        });

        if (!book) throw new NotFoundException(`book with id ${bookId} not found`);

        const bookWriter = await this.databaseService.writerBook.findFirst({
            where: {
              bookId,
              writerId,
            },
        });

        if (!bookWriter) throw new NotFoundException('book doesnt have such writer');

        await this.databaseService.writerBook.delete({
            where: {
                writerId_bookId: { writerId, bookId }
            }
        });

        return {
            status: 'success',
            message: `Writer ${writerId} removed from book ${bookId}`,
        };
    }
}

