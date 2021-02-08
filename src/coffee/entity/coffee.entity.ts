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
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @JoinTable({ name: 'coffees_flavors' })
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true,
    // eager: true,
  })
  flavors: Flavor[];
}
