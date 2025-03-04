import { Body, Controller, Get, Post } from '@nestjs/common';
import { WritersService } from './writers.service';
import { CreateWriterDto } from './dto/create-writer.dto';

@Controller('writers')
export class WritersController {
    constructor(private readonly writersService: WritersService) { };

    @Get()
    async getAllWriters() {
        return this.writersService.getAllWriters();
    }

    @Post()
    async createWriter(@Body() createWriterDto: CreateWriterDto) {
        return this.writersService.createWriter(createWriterDto);
    }
}