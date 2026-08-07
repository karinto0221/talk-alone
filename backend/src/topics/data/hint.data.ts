export type HintFactory = (topic: string) => string;

const COMMON_HINTS: readonly HintFactory[] = [
  (topic) => `「${topic}」を一言で言い換えると？`,
  (topic) => `「${topic}」を知らない人にどう説明する？`,
  (topic) => `「${topic}」で最初に思い浮かぶ場面は？`,
  (topic) => `「${topic}」にまつわる具体的な経験は？`,
  (topic) => `「${topic}」で一番印象に残っていることは？`,
  (topic) => `「${topic}」を好きな点と苦手な点は？`,
  (topic) => `「${topic}」について昔と今で変わったことは？`,
  (topic) => `「${topic}」を誰かにすすめるなら何を伝える？`,
  (topic) => `「${topic}」がなくなったら何に困る？`,
  (topic) => `「${topic}」をより良くするなら何を変える？`,
  (topic) => `「${topic}」に関する失敗や意外な発見は？`,
  (topic) => `「${topic}」を始めたきっかけは？`,
  (topic) => `「${topic}」について他の人と意見が分かれそうな点は？`,
  (topic) => `「${topic}」から学べることは？`,
  (topic) => `「${topic}」を象徴するものを一つ挙げるなら？`,
  (topic) => `「${topic}」に名前を付け直すなら？`,
  (topic) => `「${topic}」で大切にしたいことは？`,
  (topic) => `「${topic}」を明日試すなら何から始める？`,
  (topic) => `「${topic}」について反対の立場から考えると？`,
  (topic) => `「${topic}」を自分らしく語るなら何を話す？`,
];

const CATEGORY_ANGLES: Record<string, readonly string[]> = {
  daily: ['毎日の習慣', '時間の使い方', '小さな工夫', '理想と現実'],
  favorites: ['好きになった理由', '他との違い', 'こだわり', '人にすすめたい魅力'],
  memories: ['当時の気持ち', '今への影響', '周りにいた人', 'もう一度選ぶならどうするか'],
  imagination: ['実現した最初の日', '便利な点', '困る点', '一緒に体験したい人'],
  values: ['考えるようになったきっかけ', '反対の価値観', '具体的な選択', '今後も守りたいこと'],
  society: ['生活への影響', '恩恵を受ける人', '困る人', '今からできること'],
  work_learning: ['上達の方法', '初心者への助言', '失敗からの学び', '理想の環境'],
  relationships: ['相手からの見え方', '距離感', '具体的な出来事', '関係を良くする方法'],
  entertainment_culture: ['最初の印象', '記憶に残る場面', '時代による変化', '誰かに伝えたい魅力'],
  debate: ['賛成の理由', '反対の理由', '認められる例外', '立場が変わる条件'],
};

const angleFormats: readonly ((topic: string, angle: string) => string)[] = [
  (topic, angle) => `「${topic}」と${angle}はどう関係する？`,
  (topic, angle) => `${angle}に注目すると「${topic}」をどう話せる？`,
  (topic, angle) => `「${topic}」を${angle}の面から見ると？`,
  (topic, angle) => `具体例を挙げて「${topic}」と${angle}を話すなら？`,
  (topic, angle) => `${angle}を手がかりに「${topic}」を説明すると？`,
];

const CATEGORY_HINTS = Object.fromEntries(
  Object.entries(CATEGORY_ANGLES).map(([categoryId, angles]) => [
    categoryId,
    angles.flatMap((angle) =>
      angleFormats.map<HintFactory>((format) => (topic) => format(topic, angle)),
    ),
  ]),
) as Record<string, HintFactory[]>;

export const getHintCandidates = (categoryId: string, topic: string) => [
  ...COMMON_HINTS,
  ...(CATEGORY_HINTS[categoryId] ?? []),
].map((createHint) => createHint(topic));
