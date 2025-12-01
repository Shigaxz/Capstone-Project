import { Module, forwardRef } from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { SpacesController } from './spaces.controller';
import { Space, SpaceSchema } from './schemas/space.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Space.name, schema: SpaceSchema }]),
    forwardRef(() => LocationsModule),
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService],
})
export class SpacesModule {}
