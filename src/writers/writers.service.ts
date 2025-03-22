import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateWriterDto } from './dto/create-writer.dto';

@Injectable()
export class WritersService {
    constructor(private readonly databaseService: DatabaseService) { };

    async getAllWriters() {
        const writers = await this.databaseService.writer.findMany({
            select: {
                id: true,
                name: true,
                bio: true
            }
        });
        return {
            status: 'success',
            message: 'list of writers',
            data: writers
        }
    }

    async createWriter(createWriterDto: CreateWriterDto) {
        const { name, bio } = createWriterDto;
        
        const newWriter = await this.databaseService.writer.create({
            data: {
                name,
                bio
            }
        });

        return {
            status: 'success',
            message: 'writer created successfully.',
            data: newWriter
        };
    }

    async getWriterById(id: number) {
        const writer = await this.databaseService.writer.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                bio: true
            }
        });
        if (!writer) throw new NotFoundException(`writer with id ${id} not found.`);
        return {
            status:'success',
            message: 'writer: ',
            data: writer
        };
    }
}
