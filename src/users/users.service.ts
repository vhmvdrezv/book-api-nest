import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { FilterUsersDto } from './dto/filter-users.dto';
import { filter } from 'rxjs';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) { };

    async createUser(createUserDto: CreateUserDto) {
        const { firstName, lastName, email, password, phone } = createUserDto;

        const emailExists = await this.databaseService.user.findUnique({ where: { email } });
        if (emailExists) throw new ConflictException('email exists, Try another');

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.databaseService.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone
            }
        });

        return {
            status: "success",
            message: "user was created successfully",
            data: newUser
        }
    }

    async getAllUsers(filterUsersDto: FilterUsersDto) {
        const { status, page = 1, limit = 5 } = filterUsersDto;

        const totalUsers = await this.databaseService.user.count({
            where: {
                status
            }
        });

        const users = await this.databaseService.user.findMany({
            where: {
                status
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                status: true
            },
            skip: (page - 1) * limit,
            take: limit
        });

        const totalPages = Math.ceil(totalUsers / limit);

        return {
            status: 'success',
            message: 'list of users',
            data: users,
            nextPage: page < totalPages,
            prevPage: page > 1
        }
    }
}
