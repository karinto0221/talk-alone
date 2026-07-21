import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SpeechEntity } from '../speeches/speech.entity';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 16 })
  color: string;

  @Column({ name: 'display_order', type: 'smallint' })
  displayOrder: number;

  @OneToMany(() => SpeechEntity, (speech) => speech.category)
  speeches: SpeechEntity[];
}
