import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/sign-up.dto';


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

    async signup(signupDto: SignupDto){
        // validate signup data here...
        const { firstName, lastName, email, phone, password } = signupDto;

        const emailExists = await this.databaseService.user.findUnique({
            where: {
                email: email
            }
        });
        if (emailExists) throw new HttpException('email exists, Try another', 409);

        const phoneExists = await this.databaseService.user.findUnique({
            where: {
                phone: phone
            }
        })
        if (phoneExists) throw new HttpException('phone number exists, Try another', 409);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.databaseService.user.create({
            data: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email,
                password: hashedPassword,
                phone
            }
        });

        return {
            status:'success',
            message: 'user created successfully',
            data: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone
            }
        };
    }

}