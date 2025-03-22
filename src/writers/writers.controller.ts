import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WritersService } from './writers.service';
import { CreateWriterDto } from './dto/create-writer.dto';

@Controller('writers')
export class WritersController {
    constructor(private readonly writersService: WritersService) { };

    @Get()
    async getAllWriters() {
        return this.writersService.getAllWriters();
    }

    @Get(':id')
    async getWriterById(@Param('id', ParseIntPipe) id: number) {
        return this.writersService.getWriterById(id);
    }

    @Post()
    async createWriter(@Body() createWriterDto: CreateWriterDto) {
        return this.writersService.createWriter(createWriterDto);
    }
}