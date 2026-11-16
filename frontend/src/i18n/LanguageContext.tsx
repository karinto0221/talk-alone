import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppLanguage = 'ja' | 'en';

const UI_COPY = {
  ja: {
    home: 'talk-alone ホーム', interfaceLanguage: '画面言語', practiceLanguage: '練習言語', japanese: '日本語', english: 'English',
    practiceMode: '練習モード', speechMode: 'スピーチ', speechModeSub: 'お題をランダム', streamer: '配信者', streamerSub: 'コメント対応', reflex: '瞬発力', reflexSub: 'すぐに返す',
    speechDescription: '登録されたお題からランダムに1つ表示されます。そのお題について3分間話します。', streamerDescription: 'ランダムに届くコメントを拾い、設定した時間まで配信者として話し続けます。', reflexDescription: '表示された条件から連想したものや、変な組み合わせへのツッコミをすぐに声に出します。',
    duration: '練習時間', minutes: '分', seconds: '秒', commentFrequency: 'コメント頻度', training: 'トレーニング', association: '例え連想', combinationComeback: '組み合わせツッコミ', category: 'ジャンル', random: 'ランダム', start: '開始', preparingRecording: '録音を準備中',
    running: '進行中', recording: '録音中', noRecording: '録音なし', finishing: '終了処理中', stop: '終了',
    sessionComplete: (minutes: number) => `${minutes}分間、完走しました`, backToSettings: '設定画面へ戻る', keepTalking: 'コメントを拾って話し続ける', commentFeed: '配信コメント',
    associationTitle: '例え連想', combinationComebackTitle: '組み合わせツッコミ', preparingPrompt: 'お題を準備中', preparingFirstPrompt: '最初のお題を準備しています', promptUnavailable: '取得できませんでした。NEXTで再試行してください。', associationInstruction: '条件に合うものをすぐに声に出してください。', combinationComebackInstruction: '組み合わせの違和感を拾って、一言でツッコんでください。', backToSettingsShort: '設定へ戻る', preparing: '準備中',
    roundCount: '連続出題数', rounds: (count: number) => `${count}問`, showResult: '結果を見る', retry: 'もう一度',
    reflexResult: '瞬発力トレーニング結果', averageResponse: '平均回答時間', fastestResponse: '最速', slowestResponse: '最長', totalTime: '合計時間', responseHistory: '問題別の回答時間',
    streamerResult: '配信練習結果', completed: '完走', stoppedEarly: '途中終了', elapsedTime: '練習時間', completionRate: '完走率', commentCount: 'コメント数',
    speakingTime: '発話時間', speakingRate: '発話率', longestSpeech: '最長連続発話', longestSilence: '最長無音時間', longPauses: '3秒以上の無音', pauseCount: (count: number) => `${count}回`,
    voicePreparing: 'マイク準備中', voiceCalibrating: '環境音を計測中', voiceMeasuring: '発話計測中', voiceUnavailable: '音声計測なし', voiceUnavailableResult: 'マイクを利用できなかったため、発話時間の分析はありません。練習時間とコメント数は通常どおり記録されています。',
    noResult: '結果データがありません', noResultBody: '録音とリザルトは一時データのため、アプリを閉じた後や再読み込み後には表示できません。', backToTop: 'TOPに戻る', speechResult: 'スピーチ結果', recordingTitle: '録音', audioUnsupported: '音声を再生できません。', saving: '保存中', saved: '保存しました', saveRecording: '録音ファイルを保存', temporaryRecording: '録音はこの画面だけの一時データです。必要な場合は、画面を離れる前にファイルとして保存してください。', noRecordingData: '録音データはありません。', noRecordingBody: 'マイクを使用できない場合も、スピーチ練習はそのまま利用できます。', saveError: '録音ファイルを保存できませんでした。保存先を変えて再度お試しください。',
    micUnavailable: 'マイクを利用できないため、録音なしで開始しました。', topicError: 'お題を準備できませんでした。', recordingStopError: '録音を終了できませんでした。', categoryMissing: '選択したジャンルが見つかりません。', topicMissing: '利用できるお題がありません。', audioFile: '音声ファイル', loading: '読み込み中',
    frequency: { high: '高頻度', normal: '通常', low: '低頻度' },
  },
  en: {
    home: 'talk-alone home', interfaceLanguage: 'Interface', practiceLanguage: 'Practice language', japanese: '日本語', english: 'English',
    practiceMode: 'Practice mode', speechMode: 'Speech', speechModeSub: 'One random topic', streamer: 'Streamer', streamerSub: 'Respond to chat', reflex: 'Quick response', reflexSub: 'Think on your feet',
    speechDescription: 'You will receive one random topic from the built-in collection. Speak about it for three minutes.', streamerDescription: 'Pick up random chat messages and keep talking until the session ends.', reflexDescription: 'Quickly name an association or deliver a comeback to an odd word combination.',
    duration: 'Session length', minutes: 'min', seconds: 'sec', commentFrequency: 'Comment frequency', training: 'Training', association: 'Quick association', combinationComeback: 'Mash-up comeback', category: 'Category', random: 'Random', start: 'Start', preparingRecording: 'Preparing microphone',
    running: 'In progress', recording: 'Recording', noRecording: 'Not recording', finishing: 'Finishing', stop: 'Stop',
    sessionComplete: (minutes: number) => `You completed ${minutes} minutes`, backToSettings: 'Back to settings', keepTalking: 'Keep the conversation going', commentFeed: 'Viewer comments',
    associationTitle: 'Quick association', combinationComebackTitle: 'Mash-up comeback', preparingPrompt: 'Preparing prompt', preparingFirstPrompt: 'Preparing your first prompt', promptUnavailable: 'No prompt available. Select NEXT to try again.', associationInstruction: 'Say the first fitting example that comes to mind.', combinationComebackInstruction: 'Spot the mismatch and answer with a quick comeback.', backToSettingsShort: 'Back to settings', preparing: 'Preparing',
    roundCount: 'Number of prompts', rounds: (count: number) => `${count} prompts`, showResult: 'View result', retry: 'Try again',
    reflexResult: 'Quick response result', averageResponse: 'Average response', fastestResponse: 'Fastest', slowestResponse: 'Slowest', totalTime: 'Total time', responseHistory: 'Time by prompt',
    streamerResult: 'Streamer practice result', completed: 'Completed', stoppedEarly: 'Stopped early', elapsedTime: 'Practice time', completionRate: 'Completion', commentCount: 'Comments',
    speakingTime: 'Speaking time', speakingRate: 'Speaking rate', longestSpeech: 'Longest speaking streak', longestSilence: 'Longest silence', longPauses: 'Silences over 3 sec', pauseCount: (count: number) => `${count}`,
    voicePreparing: 'Preparing microphone', voiceCalibrating: 'Measuring room noise', voiceMeasuring: 'Measuring speech', voiceUnavailable: 'Speech measurement off', voiceUnavailableResult: 'Speech analysis is unavailable because the microphone could not be used. Practice time and comment count were still recorded.',
    noResult: 'No result available', noResultBody: 'Recordings and results are temporary, so they disappear after you close or reload the app.', backToTop: 'Back to top', speechResult: 'Speech result', recordingTitle: 'Recording', audioUnsupported: 'Your device cannot play this audio.', saving: 'Saving', saved: 'Saved', saveRecording: 'Save recording', temporaryRecording: 'This recording only exists on this screen. Save it before leaving if you want to keep it.', noRecordingData: 'No recording is available.', noRecordingBody: 'You can still use speech practice when microphone access is unavailable.', saveError: 'The recording could not be saved. Choose another location and try again.',
    micUnavailable: 'Microphone access is unavailable, so the session started without recording.', topicError: 'The prompt could not be prepared.', recordingStopError: 'The recording could not be stopped.', categoryMissing: 'The selected category was not found.', topicMissing: 'No prompts are available.', audioFile: 'Audio file', loading: 'Loading',
    frequency: { high: 'High', normal: 'Normal', low: 'Low' },
  },
} as const;

type LanguageContextValue = {
  uiLanguage: AppLanguage;
  practiceLanguage: AppLanguage;
  setUiLanguage: (language: AppLanguage) => void;
  setPracticeLanguage: (language: AppLanguage) => void;
  copy: typeof UI_COPY.ja | typeof UI_COPY.en;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [uiLanguage, setUiLanguage] = useState<AppLanguage>('ja');
  const [practiceLanguage, setPracticeLanguage] = useState<AppLanguage>('ja');

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
  }, [uiLanguage]);

  const value = useMemo(() => ({ uiLanguage, practiceLanguage, setUiLanguage, setPracticeLanguage, copy: UI_COPY[uiLanguage] }), [practiceLanguage, uiLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
