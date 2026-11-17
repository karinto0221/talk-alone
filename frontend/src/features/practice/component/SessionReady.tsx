import { ArrowRight, Clock3, Radio, Shuffle, Sparkles, Zap } from 'lucide-react';
import type { Category } from '../../../domain/practice';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { PracticeMode, ReflexRoundSetting, ReflexTrainingType } from '../type';
import { formatTime } from '../util/time';
import { STREAMER_COMMENT_FREQUENCIES, type StreamerCommentFrequency } from '../../streamer/config/comment-frequency';
import { useLanguage } from '../../../i18n/LanguageContext';
import { PracticeModeSelect } from './PracticeModeSelect';
import { isReflexChallenge, resolveReflexRoundCount } from '../../reflex/config/reflex-session';

type Props = {
  loading: boolean;
  categories: readonly Category[];
  categoryId: string;
  mode: PracticeMode;
  reflexTrainingType: ReflexTrainingType;
  reflexRoundSetting: ReflexRoundSetting;
  durationMinutes: number;
  streamerCommentFrequency: StreamerCommentFrequency;
  onCategoryChange: (categoryId: string) => void;
  onModeChange: (mode: PracticeMode) => void;
  onReflexTrainingTypeChange: (trainingType: ReflexTrainingType) => void;
  onReflexRoundSettingChange: (setting: ReflexRoundSetting) => void;
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
  reflexRoundSetting,
  durationMinutes,
  streamerCommentFrequency,
  onCategoryChange,
  onModeChange,
  onReflexTrainingTypeChange,
  onReflexRoundSettingChange,
  onDurationChange,
  onStreamerCommentFrequencyChange,
  onStart,
}: Props) {
  const { copy } = useLanguage();
  const selectedCategory = categories.find((category) => category.id === categoryId);
  const sectionLabel = mode === 'streamer' ? 'STREAMER PRACTICE' : mode === 'reflex' ? 'QUICK RESPONSE' : '3 MINUTE SPEECH';
  const description = mode === 'streamer'
    ? copy.streamerDescription
    : mode === 'reflex'
      ? copy.reflexDescription
      : copy.speechDescription;
  const usesCategory = mode === 'speech';
  const reflexChallenge = isReflexChallenge(reflexRoundSetting);
  const reflexRoundCount = resolveReflexRoundCount(reflexRoundSetting);

  return (
    <section className="practice-ready">
      <div className="ready-copy">
        <p className="section-label">{sectionLabel}</p>
        <h1>TALK - ALONE</h1>
        <p className="description">{description}</p>
        <div className="practice-settings">
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
                  <select
                    value={reflexRoundSetting}
                    onChange={(event) => {
                      const value = event.target.value;
                      onReflexRoundSettingChange(value === 'challenge' ? 'challenge' : Number(value) as 5 | 10);
                    }}
                  >
                    {[5, 10].map((count) => <option value={count} key={count}>{copy.rounds(count)}</option>)}
                    <option value="challenge">{copy.reflexChallengeOption}</option>
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
        <div className="preview-meta">{mode === 'reflex' ? <Zap size={16} /> : <Clock3 size={16} />} {mode === 'reflex' ? reflexChallenge ? 'CHALLENGE' : 'FREE PRACTICE' : 'SESSION TIMER'}</div>
        <strong>{mode === 'reflex' ? reflexChallenge ? '00:10' : String(reflexRoundCount).padStart(2, '0') : mode === 'streamer' ? formatTime(durationMinutes * 60) : '03:00'}</strong>
        <div className="preview-track"><span /></div>
        <div className="preview-grid">
          <span>{mode === 'streamer' || mode === 'reflex' ? 'PROMPT' : 'TOPIC'}</span>
          <span>{mode === 'streamer' ? `${copy.frequency[streamerCommentFrequency]} · ${STREAMER_COMMENT_FREQUENCIES[streamerCommentFrequency].minSeconds}–${STREAMER_COMMENT_FREQUENCIES[streamerCommentFrequency].maxSeconds} ${copy.seconds}` : mode === 'reflex' ? 'RANDOM' : selectedCategory?.name ?? 'RANDOM'}</span>
          <span>MODE</span>
          <span>{mode === 'streamer' ? 'STREAMER' : mode === 'reflex' ? 'REFLEX' : 'SPEECH'}</span>
          <span>LIMIT</span>
          <span>{mode === 'reflex' ? reflexChallenge ? '5 × 10 SEC' : `${reflexRoundCount} ROUNDS` : mode === 'streamer' ? `${durationMinutes} MIN` : '3 MIN'}</span>
        </div>
      </div>
    </section>
  );
}
