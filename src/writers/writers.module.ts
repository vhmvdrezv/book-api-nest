import { Module } from '@nestjs/common';
import { WritersController } from './writers.controller';
import { WritersService } from './writers.service';
import { DatabaseService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WritersController],
  providers: [WritersService]
})
export class WritersModule {}
