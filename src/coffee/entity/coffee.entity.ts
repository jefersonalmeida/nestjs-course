import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity({ name: 'coffees' })
export class Coffee {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  brand: string;

  @ApiProperty()
  @Column({ default: 0 })
  recommendations: number;

  @ApiProperty()
  @JoinTable()
  @JoinTable({ name: 'coffees_flavors' })
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
    // eager: true,
  })
  flavors: Flavor[];
}
