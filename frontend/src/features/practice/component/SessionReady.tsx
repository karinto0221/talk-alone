import { ArrowRight, Clock3, FileText, MessageCircle, Radio, Shuffle, Sparkles, Type, Zap } from 'lucide-react';
import type { Category } from '../../../api';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticeMode, ReflexTrainingType } from '../type';
import { formatTime } from '../util/time';

type Props = {
  loading: boolean;
  categoriesLoading: boolean;
  categories: Category[];
  categoryId: string;
  mode: PracticeMode;
  reflexTrainingType: ReflexTrainingType;
  durationMinutes: number;
  onCategoryChange: (categoryId: string) => void;
  onModeChange: (mode: PracticeMode) => void;
  onReflexTrainingTypeChange: (trainingType: ReflexTrainingType) => void;
  onDurationChange: (durationMinutes: number) => void;
  onStart: () => void;
};

export function SessionReady({
  loading,
  categoriesLoading,
  categories,
  categoryId,
  mode,
  reflexTrainingType,
  durationMinutes,
  onCategoryChange,
  onModeChange,
  onReflexTrainingTypeChange,
  onDurationChange,
  onStart,
}: Props) {
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const sectionLabel = mode === 'streamer' ? 'STREAMER PRACTICE' : mode === 'reflex' ? 'QUICK RESPONSE' : '3 MINUTE SPEECH';
  const description = mode === 'streamer'
    ? 'ランダムに届くコメントを拾い、設定した時間まで配信者として話し続けます。'
    : mode === 'reflex'
      ? '表示されたコメントやお題に対して、思いついた返しをすぐに声に出します。'
      : 'お題を選び、3分間話します。途中で話題に困った場合はヒントを表示できます。';
  const usesCategory = mode === 'standard' || mode === 'word';

  return (
    <section className="practice-ready">
      <div className="ready-copy">
        <p className="section-label">{sectionLabel}</p>
        <h1>TALK - ALONE</h1>
        <p className="description">{description}</p>
        <div className="practice-settings">
          <fieldset className="setting-group">
            <legend>練習モード</legend>
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
              <label className={mode === 'streamer' ? 'mode-option selected' : 'mode-option'}>
                <input type="radio" name="topic-mode" checked={mode === 'streamer'} onChange={() => onModeChange('streamer')} />
                <Radio size={16} />
                <span><b>配信者</b><small>コメント対応</small></span>
              </label>
              <label className={mode === 'reflex' ? 'mode-option selected' : 'mode-option'}>
                <input type="radio" name="topic-mode" checked={mode === 'reflex'} onChange={() => onModeChange('reflex')} />
                <Zap size={16} />
                <span><b>瞬発力</b><small>すぐに返す</small></span>
              </label>
            </div>
          </fieldset>
          {mode === 'streamer' ? (
            <label className="setting-group duration-setting">
              <span>練習時間</span>
              <div className="duration-input">
                <Clock3 size={15} />
                <input type="number" min="1" max="60" step="1" value={durationMinutes} onChange={(event) => onDurationChange(Number(event.target.value))} />
                <b>分</b>
              </div>
            </label>
          ) : mode === 'reflex' ? (
            <fieldset className="setting-group">
              <legend>トレーニング</legend>
              <div className="reflex-type-options">
                <label className={reflexTrainingType === 'comment' ? 'reflex-type-option selected' : 'reflex-type-option'}>
                  <input type="radio" name="reflex-type" checked={reflexTrainingType === 'comment'} onChange={() => onReflexTrainingTypeChange('comment')} />
                  <MessageCircle size={16} />
                  <span><b>コメント返し</b><small>配信コメントに返す</small></span>
                </label>
                <label className={reflexTrainingType === 'analogy' ? 'reflex-type-option selected' : 'reflex-type-option'}>
                  <input type="radio" name="reflex-type" checked={reflexTrainingType === 'analogy'} onChange={() => onReflexTrainingTypeChange('analogy')} />
                  <Sparkles size={16} />
                  <span><b>例えツッコミ</b><small>3形式をミックス</small></span>
                </label>
              </div>
            </fieldset>
          ) : (
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
          )}
        </div>
        <Button
          onClick={onStart}
          disabled={loading || (usesCategory && (categoriesLoading || categories.length === 0))}
          icon={loading || (usesCategory && categoriesLoading) ? <LoadingSpinner /> : <ArrowRight size={18} />}
        >
          {loading ? 'お題を取得中' : usesCategory && categoriesLoading ? 'ジャンルを取得中' : '開始'}
        </Button>
      </div>
      <div className="timer-preview" aria-hidden="true">
        <div className="preview-meta">{mode === 'reflex' ? <Zap size={16} /> : <Clock3 size={16} />} {mode === 'reflex' ? 'FREE PRACTICE' : 'SESSION TIMER'}</div>
        <strong>{mode === 'reflex' ? 'FREE' : mode === 'streamer' ? formatTime(durationMinutes * 60) : '03:00'}</strong>
        <div className="preview-track"><span /></div>
        <div className="preview-grid">
          <span>{mode === 'streamer' || mode === 'reflex' ? 'PROMPT' : 'TOPIC'}</span>
          <span>{mode === 'streamer' ? 'RANDOM COMMENTS' : mode === 'reflex' ? 'RANDOM' : selectedCategory?.name ?? 'RANDOM'}</span>
          <span>MODE</span>
          <span>{mode === 'streamer' ? 'STREAMER' : mode === 'reflex' ? 'REFLEX' : mode === 'word' ? 'WORD' : 'STANDARD'}</span>
          <span>LIMIT</span>
          <span>{mode === 'reflex' ? 'NONE' : mode === 'streamer' ? `${durationMinutes} MIN` : '3 MIN'}</span>
        </div>
      </div>
    </section>
  );
}
