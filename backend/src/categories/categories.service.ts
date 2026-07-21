import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  findAll() {
    return this.categoriesRepository.findAll();
  }

  async findById(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) throw new NotFoundException('指定されたジャンルは存在しません。');
    return category;
  }

  async findRandom() {
    const category = await this.categoriesRepository.findRandom();
    if (!category) throw new NotFoundException('利用できるジャンルがありません。');
    return category;
  }
}
