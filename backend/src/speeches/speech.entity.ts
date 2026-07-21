import { Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryEntity } from '../categories/category.entity';

@Entity({ name: 'speeches' })
@Check('CHK_speeches_duration', '"duration_seconds" BETWEEN 1 AND 180')
@Check('CHK_speeches_help_count', '"help_count" >= 0')
@Index('IDX_speeches_completed_at', ['completedAt'])
@Index('IDX_speeches_category_completed', ['categoryId', 'completedAt'])
export class SpeechEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  topic: string;

  @Column({ name: 'category_id', type: 'varchar', length: 32 })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.speeches, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ name: 'duration_seconds', type: 'smallint' })
  durationSeconds: number;

  @Column({ name: 'help_count', type: 'smallint', default: 0 })
  helpCount: number;

  @Column({ name: 'completed_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;
}
