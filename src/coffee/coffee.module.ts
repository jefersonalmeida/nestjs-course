import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../event/entity/event.entity';
import { COFFEE_BRANDS } from './coffee.constants';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import coffeeConfig from './config/coffee.config';
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entity/flavor.entity';

/* class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {} */

@Injectable()
export class CoffeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [
    ConfigModule.forFeature(coffeeConfig),
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
  ],
  controllers: [CoffeeController],
  providers: [
    CoffeeService,
    CoffeBrandsFactory,
    /* {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    }, */
    {
      provide: COFFEE_BRANDS,
      // useValue: ['buddy brew', 'nescafe'],
      useFactory: () => ['buddy brew', 'nescafe'],
      // useFactory: (brandsFactory: CoffeBrandsFactory) => brandsFactory.create(),
      // inject: [CoffeBrandsFactory],
      /* useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeBrands = await connection.query('SELECT * ...');
        const coffeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeBrands;
      },
      inject: [Connection], */
    },
  ],
  exports: [CoffeeService],
})
export class CoffeeModule {}
