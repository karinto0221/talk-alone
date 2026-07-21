import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(@InjectRepository(CategoryEntity) private readonly repository: Repository<CategoryEntity>) {}

  findAll() {
    return this.repository.find({ order: { displayOrder: 'ASC' } });
  }

  findById(id: string) {
    return this.repository.findOneBy({ id });
  }

  async findRandom() {
    return this.repository.createQueryBuilder('category').orderBy('RANDOM()').getOne();
  }
}
