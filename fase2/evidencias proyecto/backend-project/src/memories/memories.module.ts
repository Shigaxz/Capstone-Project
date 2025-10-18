import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { Memory, MemorySchema } from './schemas/memory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Memory.name, schema: MemorySchema }]),
  ],
  controllers: [MemoriesController],
  providers: [MemoriesService],
})
export class MemoriesModule {}
