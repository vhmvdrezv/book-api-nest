import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService
    ) { };

    async validate(email: string, password: string) {
        const user = await this.databaseService.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) return null;

        const result = await bcrypt.compare(password, user.password);
        if (!result) return null;

        return user
    }

    async login(user: User) {
        const payload = { sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        return {
            status: 'success',
            message: 'user logged in',
            data: accessToken
        };
    }

}