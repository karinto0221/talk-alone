import { ArrowRight, Clock3, FileText, Shuffle, Type } from 'lucide-react';
import type { Category, TopicMode } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

type Props = {
  loading: boolean;
  categoriesLoading: boolean;
  categories: Category[];
  categoryId: string;
  mode: TopicMode;
  onCategoryChange: (categoryId: string) => void;
  onModeChange: (mode: TopicMode) => void;
  onStart: () => void;
};

export function SessionReady({
  loading,
  categoriesLoading,
  categories,
  categoryId,
  mode,
  onCategoryChange,
  onModeChange,
  onStart,
}: Props) {
  const selectedCategory = categories.find((category) => category.id === categoryId);

  return (
    <section className="practice-ready">
      <div className="ready-copy">
        <p className="section-label">3 MINUTE SPEECH</p>
        <h1>TALK - ALONE</h1>
        <p className="description">お題を選び、3分間話します。途中で話題に困った場合はヒントを表示できます。</p>
        <div className="practice-settings">
          <fieldset className="setting-group">
            <legend>出題モード</legend>
            <div className="mode-options">
              <label className={mode === 'standard' ? 'mode-option selected' : 'mode-option'}>
                <input type="radio" name="topic-mode" checked={mode === 'standard'} onChange={() => onModeChange('standard')} />
                <FileText size={16} />
                <span><b>スタンダード</b><small>文章・問い</small></span>
              </label>
              <label className={mode === 'word' ? 'mode-option selected' : 'mode-option'}>
                <input type="radio" name="topic-mode" checked={mode === 'word'} onChange={() => onModeChange('word')} />
                <Type size={16} />
                <span><b>ワード</b><small>1単語のみ</small></span>
              </label>
            </div>
          </fieldset>
          <label className="setting-group category-setting">
            <span>ジャンル</span>
            <div className="select-wrap">
              <Shuffle size={15} />
              <select value={categoryId} onChange={(event) => onCategoryChange(event.target.value)} disabled={categoriesLoading}>
                <option value="">ランダム</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
          </label>
        </div>
        <Button
          onClick={onStart}
          disabled={loading || categoriesLoading || categories.length === 0}
          icon={loading || categoriesLoading ? <LoadingSpinner /> : <ArrowRight size={18} />}
        >
          {loading ? 'お題を取得中' : categoriesLoading ? 'ジャンルを取得中' : '開始'}
        </Button>
      </div>
      <div className="timer-preview" aria-hidden="true">
        <div className="preview-meta"><Clock3 size={16} /> SESSION TIMER</div>
        <strong>03:00</strong>
        <div className="preview-track"><span /></div>
        <div className="preview-grid">
          <span>TOPIC</span>
          <span>{selectedCategory?.name ?? 'RANDOM'}</span>
          <span>MODE</span>
          <span>{mode === 'word' ? 'WORD' : 'STANDARD'}</span>
          <span>LIMIT</span>
          <span>3 MIN</span>
        </div>
      </div>
    </section>
  );
}
