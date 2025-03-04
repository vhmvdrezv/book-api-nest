import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
    constructor(private readonly databaseService: DatabaseService) { };
   
    async getAllBooks() {
        const books = await this.databaseService.book.findMany();

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
}

