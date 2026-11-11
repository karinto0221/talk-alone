import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AppLanguage = 'ja' | 'en';

const UI_COPY = {
  ja: {
    home: 'talk-alone ホーム', interfaceLanguage: '画面言語', practiceLanguage: '練習言語', japanese: '日本語', english: 'English',
    practiceMode: '練習モード', standard: 'スタンダード', standardSub: '文章・問い', word: 'ワード', wordSub: '1単語のみ', streamer: '配信者', streamerSub: 'コメント対応', reflex: '瞬発力', reflexSub: 'すぐに返す',
    speechDescription: 'お題を選び、3分間話します。途中で話題に困った場合はヒントを表示できます。', streamerDescription: 'ランダムに届くコメントを拾い、設定した時間まで配信者として話し続けます。', reflexDescription: '表示されたコメントやお題に対して、思いついた返しをすぐに声に出します。',
    duration: '練習時間', minutes: '分', seconds: '秒', commentFrequency: 'コメント頻度', training: 'トレーニング', commentReply: 'コメント返し', commentReplySub: '配信コメントに返す', analogy: '例えツッコミ', analogySub: '3形式をミックス', category: 'ジャンル', random: 'ランダム', start: '開始', preparingRecording: '録音を準備中',
    running: '進行中', recording: '録音中', noRecording: '録音なし', hint: 'ヒント', showHint: 'ヒントを表示', finishing: '終了処理中', stop: '終了',
    sessionComplete: (minutes: number) => `${minutes}分間、完走しました`, backToSettings: '設定画面へ戻る', keepTalking: 'コメントを拾って話し続ける', commentFeed: '配信コメント',
    replyTitle: 'コメント返し', analogyTitle: '例えツッコミ', preparingPrompt: 'お題を準備中', preparingFirstPrompt: '最初のお題を準備しています', promptUnavailable: '取得できませんでした。NEXTで再試行してください。', replyInstruction: '配信者として自然な返しを声に出してください。', analogyInstruction: '思いついた例えやツッコミをすぐに声に出してください。', backToSettingsShort: '設定へ戻る', preparing: '準備中',
    noResult: '結果データがありません', noResultBody: '録音とリザルトは一時データのため、アプリを閉じた後や再読み込み後には表示できません。', backToPractice: '練習画面へ戻る', speechResult: 'スピーチ結果', nextSpeech: '次のスピーチへ', recordingTitle: '録音', audioUnsupported: '音声を再生できません。', saving: '保存中', saved: '保存しました', saveRecording: '録音ファイルを保存', temporaryRecording: '録音はこの画面だけの一時データです。必要な場合は、画面を離れる前にファイルとして保存してください。', noRecordingData: '録音データはありません。', noRecordingBody: 'マイクを使用できない場合も、スピーチ練習はそのまま利用できます。', saveError: '録音ファイルを保存できませんでした。保存先を変えて再度お試しください。',
    micUnavailable: 'マイクを利用できないため、録音なしで開始しました。', topicError: 'お題を準備できませんでした。', recordingStopError: '録音を終了できませんでした。', categoryMissing: '選択したジャンルが見つかりません。', topicMissing: '利用できるお題がありません。', audioFile: '音声ファイル', loading: '読み込み中',
    frequency: { high: '高頻度', normal: '通常', low: '低頻度' },
  },
  en: {
    home: 'talk-alone home', interfaceLanguage: 'Interface', practiceLanguage: 'Practice language', japanese: '日本語', english: 'English',
    practiceMode: 'Practice mode', standard: 'Standard', standardSub: 'Questions and topics', word: 'Word', wordSub: 'One word only', streamer: 'Streamer', streamerSub: 'Respond to chat', reflex: 'Quick response', reflexSub: 'Think on your feet',
    speechDescription: 'Choose a topic and speak for three minutes. Use a hint if you run out of things to say.', streamerDescription: 'Pick up random chat messages and keep talking until the session ends.', reflexDescription: 'Respond out loud to each comment or prompt as quickly as you can.',
    duration: 'Session length', minutes: 'min', seconds: 'sec', commentFrequency: 'Comment frequency', training: 'Training', commentReply: 'Chat response', commentReplySub: 'Reply to a viewer', analogy: 'Analogy comeback', analogySub: 'Three prompt styles', category: 'Category', random: 'Random', start: 'Start', preparingRecording: 'Preparing microphone',
    running: 'In progress', recording: 'Recording', noRecording: 'Not recording', hint: 'Hint', showHint: 'Show hint', finishing: 'Finishing', stop: 'Stop',
    sessionComplete: (minutes: number) => `You completed ${minutes} minutes`, backToSettings: 'Back to settings', keepTalking: 'Keep the conversation going', commentFeed: 'Viewer comments',
    replyTitle: 'Chat response', analogyTitle: 'Analogy comeback', preparingPrompt: 'Preparing prompt', preparingFirstPrompt: 'Preparing your first prompt', promptUnavailable: 'No prompt available. Select NEXT to try again.', replyInstruction: 'Answer out loud as if you were speaking to a live viewer.', analogyInstruction: 'Say the first fitting comparison or comeback that comes to mind.', backToSettingsShort: 'Back to settings', preparing: 'Preparing',
    noResult: 'No result available', noResultBody: 'Recordings and results are temporary, so they disappear after you close or reload the app.', backToPractice: 'Back to practice', speechResult: 'Speech result', nextSpeech: 'Next speech', recordingTitle: 'Recording', audioUnsupported: 'Your device cannot play this audio.', saving: 'Saving', saved: 'Saved', saveRecording: 'Save recording', temporaryRecording: 'This recording only exists on this screen. Save it before leaving if you want to keep it.', noRecordingData: 'No recording is available.', noRecordingBody: 'You can still use speech practice when microphone access is unavailable.', saveError: 'The recording could not be saved. Choose another location and try again.',
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
