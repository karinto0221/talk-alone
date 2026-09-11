export type AnalogyPromptKind = 'intensity' | 'object_action' | 'description';

export type AnalogyPrompt = {
  kind: AnalogyPromptKind;
  label: string;
  text: string;
};

const INTENSIFIERS = [
  'めっちゃ', '異常に', '引くほど', '信じられないくらい', '笑うほど',
  '怖いくらい', 'びっくりするほど', '見たことないくらい', 'どうかしてるほど', 'ありえないくらい',
] as const;

const INTENSITY_CONTEXTS = ['', '見た目が', '動きが', '触ると', '想像より'] as const;

const ADJECTIVES = [
  '遅い', '速い', '高い', '安い', '苦い', '甘い', '辛い', '綺麗', '汚い', '狭い',
  '広い', '長い', '短い', '硬い', '柔らかい', '静か', 'うるさい', '古い', '新しい', '眩しい',
  '暗い', '重い', '軽い', '冷たい', '熱い', '大きい', '小さい', '遠い', '近い', '薄い',
] as const;

const OBJECTS_BY_ACTION = {
  '食べる': ['ピアノ', '信号機', '冷蔵庫', '東京タワー', '教室', '自動販売機', '月', '電車'],
  '着る': ['冷蔵庫', '改札', '富士山', 'ピアノ', '公園', '踏切', '本棚', '観覧車'],
  '煮込む': ['履歴書', 'スマートフォン', '校舎', '目覚まし時計', '信号機', '教科書', 'エレベーター', '雲'],
  '折り畳む': ['富士山', '電車', '体育館', '虹', '商店街', '観覧車', '滑り台', '海'],
  '冷凍する': ['花火', 'ラジオ', '夕焼け', '改札', '運動会', '信号機', '夏休み', '会議'],
  '飼う': ['エレベーター', '台風', '新幹線', '横断歩道', '雷', '自動販売機', '月曜日', '冷蔵庫'],
  '洗濯する': ['ピアノ', '東京タワー', '教室', '公園', '履歴書', '信号機', '自転車', '雲'],
  '充電する': ['富士山', '給食', '体育館', '踏切', '夕焼け', '校長先生', '観覧車', '海'],
  '植える': ['冷蔵庫', '新幹線', 'ピアノ', '自動販売機', '信号機', 'ソファ', 'エレベーター', '時計'],
  '持ち帰る': ['富士山', '改札', '観覧車', '横断歩道', '体育館', '虹', '公園', '月'],
  'レンタルする': ['台風', '校舎', '夕焼け', '信号機', '海', '踏切', '雲', '月曜日'],
  '配達する': ['富士山', '運動会', '観覧車', '体育館', '虹', 'エレベーター', '夏休み', '東京タワー'],
} as const;

const OBJECT_MODIFIERS = ['', '巨大な', '透明な', '金色の', '空飛ぶ'] as const;

const NOUNS_BY_ADJECTIVE = {
  '低い': ['山', '天井', 'ハードル', '声', '目標'],
  '高い': ['プリン', '自転車', 'おにぎり', 'ベンチ', '帽子'],
  '長い': ['会議', '廊下', '自己紹介', '信号待ち', '前置き'],
  '短い': ['映画', '夏休み', 'エスカレーター', '昼休み', '手紙'],
  '狭い': ['部屋', '公園', '改札', '歩道', '舞台'],
  '広い': ['玄関', '机', 'ベランダ', '本棚', '自転車置き場'],
  '綺麗な': ['人', '字', '寝癖', 'レシート', '水たまり'],
  '汚い': ['空', '雪だるま', '鏡', '白シャツ', '雲'],
  '速い': ['散歩', '昼寝', '会議', '食事', 'エレベーター'],
  '遅い': ['拍手', 'エスカレーター', '目覚まし', '返信', 'ジェットコースター'],
  '硬い': ['プリン', '枕', 'パン', 'ソファ', 'たこ焼き'],
  '柔らかい': ['机', '階段', '信号機', '自転車', '校舎'],
  '静かな': ['花火大会', '運動会', 'ライブ会場', '工事現場', '商店街'],
  'うるさい': ['図書館', '雪', '手紙', '写真', '冷蔵庫'],
  '小さい': ['富士山', '体育館', '観覧車', '空港', 'デパート'],
  '大きい': ['消しゴム', '目薬', '付箋', '飴', 'イヤホン'],
} as const;

const DESCRIPTION_MODIFIERS = ['', '世界一', '町で一番', '想像以上に', '妙に'] as const;

const objectActionVariationCount = Object.values(OBJECTS_BY_ACTION)
  .reduce((total, objects) => total + objects.length, 0) * OBJECT_MODIFIERS.length;
const descriptionVariationCount = Object.values(NOUNS_BY_ADJECTIVE)
  .reduce((total, nouns) => total + nouns.length, 0) * DESCRIPTION_MODIFIERS.length;

export const ANALOGY_PROMPT_VARIATION_COUNT =
  INTENSITY_CONTEXTS.length * INTENSIFIERS.length * ADJECTIVES.length
  + objectActionVariationCount
  + descriptionVariationCount;

const sample = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

function createIntensityPrompt(): AnalogyPrompt {
  return {
    kind: 'intensity',
    label: '特徴を例える',
    text: `${sample(INTENSITY_CONTEXTS)}${sample(INTENSIFIERS)}${sample(ADJECTIVES)}`,
  };
}

function createObjectActionPrompt(): AnalogyPrompt {
  const actions = Object.keys(OBJECTS_BY_ACTION) as Array<keyof typeof OBJECTS_BY_ACTION>;
  const action = sample(actions);
  return {
    kind: 'object_action',
    label: '無茶振りに返す',
    text: `${sample(OBJECT_MODIFIERS)}${sample(OBJECTS_BY_ACTION[action])}を${action}`,
  };
}

function createDescriptionPrompt(): AnalogyPrompt {
  const adjectives = Object.keys(NOUNS_BY_ADJECTIVE) as Array<keyof typeof NOUNS_BY_ADJECTIVE>;
  const adjective = sample(adjectives);
  return {
    kind: 'description',
    label: '具体例を出す',
    text: `${sample(DESCRIPTION_MODIFIERS)}${adjective}${sample(NOUNS_BY_ADJECTIVE[adjective])}`,
  };
}

const PROMPT_CREATORS = [createIntensityPrompt, createObjectActionPrompt, createDescriptionPrompt] as const;

export function createAnalogyPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = sample(PROMPT_CREATORS)();
    if (prompt.text !== previousText) return prompt;
  }
  return createObjectActionPrompt();
}
