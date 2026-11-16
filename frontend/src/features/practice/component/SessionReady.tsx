import { ArrowRight, Clock3, Languages, Radio, Shuffle, Sparkles, Zap } from 'lucide-react';
import type { Category } from '../../../domain/practice';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticeMode, ReflexTrainingType } from '../type';
import { formatTime } from '../util/time';
import { STREAMER_COMMENT_FREQUENCIES, type StreamerCommentFrequency } from '../../streamer/config/comment-frequency';
import { useLanguage, type AppLanguage } from '../../../i18n/LanguageContext';
import { PracticeModeSelect } from './PracticeModeSelect';

type Props = {
  loading: boolean;
  categories: readonly Category[];
  categoryId: string;
  mode: PracticeMode;
  reflexTrainingType: ReflexTrainingType;
  reflexRoundCount: number;
  durationMinutes: number;
  streamerCommentFrequency: StreamerCommentFrequency;
  onCategoryChange: (categoryId: string) => void;
  onModeChange: (mode: PracticeMode) => void;
  onReflexTrainingTypeChange: (trainingType: ReflexTrainingType) => void;
  onReflexRoundCountChange: (roundCount: number) => void;
  onDurationChange: (durationMinutes: number) => void;
  onStreamerCommentFrequencyChange: (frequency: StreamerCommentFrequency) => void;
  onStart: () => void;
};

export function SessionReady({
  loading,
  categories,
  categoryId,
  mode,
  reflexTrainingType,
  reflexRoundCount,
  durationMinutes,
  streamerCommentFrequency,
  onCategoryChange,
  onModeChange,
  onReflexTrainingTypeChange,
  onReflexRoundCountChange,
  onDurationChange,
  onStreamerCommentFrequencyChange,
  onStart,
}: Props) {
  const { practiceLanguage, setPracticeLanguage, copy } = useLanguage();
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const sectionLabel = mode === 'streamer' ? 'STREAMER PRACTICE' : mode === 'reflex' ? 'QUICK RESPONSE' : '3 MINUTE SPEECH';
  const description = mode === 'streamer'
    ? copy.streamerDescription
    : mode === 'reflex'
      ? copy.reflexDescription
      : copy.speechDescription;
  const usesCategory = mode === 'speech';

  return (
    <section className="practice-ready">
      <div className="ready-copy">
        <p className="section-label">{sectionLabel}</p>
        <h1>TALK - ALONE</h1>
        <p className="description">{description}</p>
        <div className="practice-settings">
          <label className="setting-group practice-language-setting">
            <span>{copy.practiceLanguage}</span>
            <div className="select-wrap">
              <Languages size={15} />
              <select value={practiceLanguage} onChange={(event) => setPracticeLanguage(event.target.value as AppLanguage)}>
                <option value="ja">{copy.japanese}</option>
                <option value="en">{copy.english}</option>
              </select>
            </div>
          </label>
          <fieldset className="setting-group">
            <legend>{copy.practiceMode}</legend>
            <PracticeModeSelect value={mode} onChange={onModeChange} />
          </fieldset>
          {mode === 'streamer' ? (
            <>
              <label className="setting-group duration-setting">
                <span>{copy.duration}</span>
                <div className="duration-input">
                  <Clock3 size={15} />
                  <input type="number" min="1" max="60" step="1" value={durationMinutes} onChange={(event) => onDurationChange(Number(event.target.value))} />
                  <b>{copy.minutes}</b>
                </div>
              </label>
              <label className="setting-group">
                <span>{copy.commentFrequency}</span>
                <div className="select-wrap">
                  <Radio size={15} />
                  <select value={streamerCommentFrequency} onChange={(event) => onStreamerCommentFrequencyChange(event.target.value as StreamerCommentFrequency)}>
                    {Object.entries(STREAMER_COMMENT_FREQUENCIES).map(([frequencyId, option]) => {
                      const frequency = frequencyId as StreamerCommentFrequency;
                      return <option value={frequency} key={frequency}>{copy.frequency[frequency]}（{option.minSeconds}–{option.maxSeconds} {copy.seconds}）</option>;
                    })}
                  </select>
                </div>
              </label>
            </>
          ) : mode === 'reflex' ? (
            <>
              <label className="setting-group">
                <span>{copy.training}</span>
                <div className="select-wrap">
                  {reflexTrainingType === 'association' ? <Sparkles size={15} /> : <Shuffle size={15} />}
                  <select value={reflexTrainingType} onChange={(event) => onReflexTrainingTypeChange(event.target.value as ReflexTrainingType)}>
                    <option value="association">{copy.association}</option>
                    <option value="combination">{copy.combinationComeback}</option>
                  </select>
                </div>
              </label>
              <label className="setting-group">
                <span>{copy.roundCount}</span>
                <div className="select-wrap">
                  <Zap size={15} />
                  <select value={reflexRoundCount} onChange={(event) => onReflexRoundCountChange(Number(event.target.value))}>
                    {[5, 10, 20].map((count) => <option value={count} key={count}>{copy.rounds(count)}</option>)}
                  </select>
                </div>
              </label>
            </>
          ) : (
            <label className="setting-group category-setting">
              <span>{copy.category}</span>
              <div className="select-wrap">
                <Shuffle size={15} />
                <select value={categoryId} onChange={(event) => onCategoryChange(event.target.value)}>
                  <option value="">{copy.random}</option>
                  {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </div>
            </label>
          )}
        </div>
        <Button
          onClick={onStart}
          disabled={loading || (usesCategory && categories.length === 0)}
          icon={loading ? <LoadingSpinner /> : <ArrowRight size={18} />}
        >
          {loading ? copy.preparingRecording : copy.start}
        </Button>
      </div>
      <div className="timer-preview" aria-hidden="true">
        <div className="preview-meta">{mode === 'reflex' ? <Zap size={16} /> : <Clock3 size={16} />} {mode === 'reflex' ? 'FREE PRACTICE' : 'SESSION TIMER'}</div>
        <strong>{mode === 'reflex' ? String(reflexRoundCount).padStart(2, '0') : mode === 'streamer' ? formatTime(durationMinutes * 60) : '03:00'}</strong>
        <div className="preview-track"><span /></div>
        <div className="preview-grid">
          <span>{mode === 'streamer' || mode === 'reflex' ? 'PROMPT' : 'TOPIC'}</span>
          <span>{mode === 'streamer' ? `${copy.frequency[streamerCommentFrequency]} · ${STREAMER_COMMENT_FREQUENCIES[streamerCommentFrequency].minSeconds}–${STREAMER_COMMENT_FREQUENCIES[streamerCommentFrequency].maxSeconds} ${copy.seconds}` : mode === 'reflex' ? 'RANDOM' : selectedCategory?.name ?? 'RANDOM'}</span>
          <span>MODE</span>
          <span>{mode === 'streamer' ? 'STREAMER' : mode === 'reflex' ? 'REFLEX' : 'SPEECH'}</span>
          <span>LIMIT</span>
          <span>{mode === 'reflex' ? `${reflexRoundCount} ROUNDS` : mode === 'streamer' ? `${durationMinutes} MIN` : '3 MIN'}</span>
        </div>
      </div>
    </section>
  );
}
