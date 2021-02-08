import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/entity/event.entity';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entity/flavor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeeController],
  providers: [CoffeeService],
})
export class CoffeeModule {}
