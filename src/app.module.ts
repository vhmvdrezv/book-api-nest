import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';
import { WritersModule } from './writers/writers.module';

@Module({
  imports: [BooksModule, DatabaseModule, WritersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
