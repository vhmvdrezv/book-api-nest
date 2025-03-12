import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';
import { WritersModule } from './writers/writers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [BooksModule, DatabaseModule, WritersModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
