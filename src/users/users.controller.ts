import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { FilterUsersDto } from './dto/filter-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { };

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Get()
    async getAllUsers(@Query() filterUserDto: FilterUsersDto) {
        return this.usersService.getAllUsers(filterUserDto);
    }
}
