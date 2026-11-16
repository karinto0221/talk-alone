export type AnalogyPromptKind = 'intensity' | 'object_action' | 'description';

export type AnalogyPrompt = {
  kind: AnalogyPromptKind;
  label: string;
  text: string;
};

const INTENSITY_MODIFIERS = [
  'めっちゃ', 'かなり', '異常に', '鬼のように', '信じられないくらい', '笑うほど',
  '怖いくらい', '言われてみれば', '見たことないくらい', 'よく考えると', '今になってみれば',
  '意外と', '思ったより', '予想以上に', '妙に', 'やたら', '地味に', 'なぜか',
  '安定して', 'ずっと', 'たまに', '急に', '無駄に', '絶妙に', '若干', 'ほんのり',
  'そこそこ', '圧倒的に', '微妙に', 'なぜか', '相変わらず','呆れるほど','流石に',
] as const;

const ADJECTIVES = [
  '遅い', '速い', '高い', '安い', '苦い', '甘い', '辛い', '酸っぱい', 'しょっぱい', '美味しい',
  'まずい', '綺麗', '汚い', '狭い', '広い', '長い', '短い', '硬い', '柔らかい', '静か',
  'うるさい', '古い', '新しい', '眩しい', '暗い', '重い', '軽い', '冷たい', '熱い', 'ぬるい',
  '大きい', '小さい', '遠い', '近い', '薄い', '厚い', '細い', '太い', '深い', '浅い',
  '強い', '弱い', '明るい', '丸い', '四角い', '鋭い', '鈍い', '臭い', '香ばしい', '滑らか',
  'ざらざら', 'ふわふわ', 'べたべた', '乾いてる', '湿ってる', '暖かい', '涼しい', '怖い', '優しい', '厳しい',
  '面白い', 'つまらない', '楽しい', '悲しい', '嬉しい', '恥ずかしい', 'かわいい', 'かっこいい', 'ダサい', '怪しい',
  '自然', '不自然', '便利', '不便', '簡単', '難しい', '複雑', '単純', '派手', '地味',
  '豪華', '質素', '丁寧', '雑', '真面目', '適当', '賢い', 'ずるい', '素早い', 'のんびりしてる',
  '元気', '眠そう', '懐かしい', '珍しい', '普通', '独特', '危ない', '安全', '頑丈', '壊れやすい',
] as const;

const OBJECTS = [
  'ピアノ', '信号機', '冷蔵庫', '東京タワー', '教室', '自動販売機', '月', '電車',
  '改札', '富士山', '公園', '踏切', '本棚', '観覧車', '履歴書', 'スマートフォン',
  '校舎', '目覚まし時計', '教科書', 'エレベーター', '雲', '体育館', '虹', '商店街',
  '滑り台', '海', '花火', 'ラジオ', '夕焼け', '運動会', '夏休み', '会議',
  '台風', '新幹線', '横断歩道', '雷', '月曜日', '自転車', '給食', '校長先生',
  'ソファ', '時計',
] as const;

const ACTIONS = [
  'を食べる', 'を着る', 'を煮込む', 'を折り畳む', 'を冷凍する', 'を飼う',
  'を洗濯する', 'を充電する', 'を植える', 'を持ち帰る', 'をレンタルする', 'を配達する',
  'を投げる', 'を焼く', 'を飲む', 'を拾う', 'を売る', 'を買う',
  'に乗る', 'を修理する', 'を予約する', 'を褒める', 'を起こす', 'を片付ける',
  'を磨く', 'を切る', 'を混ぜる', 'を飾る', 'を運ぶ', 'を隠す',
  'を育てる', 'を撮影する', 'を印刷する', 'を包装する', 'を解凍する', 'に応募する',
  'を面接する', 'を交換する', 'を返品する', 'を演奏する',
] as const;

const OBJECT_MODIFIERS = [
  '巨大な', '透明な', '金色の', '空飛ぶ', '手のひらサイズの', 'びしょ濡れの',
  '発光する', 'しゃべる', '眠っている', '高級な', '中古の', '最新型の',
  '壊れかけの', '世界最後の', '偽物の', '期間限定の', '無人の', '逆さまの',
  '冷え切った', 'やたら重い',
  'ミニチュアの', '等身大の', '虹色の', '真っ黒な', '真っ白な', '半透明の',
  '音が鳴る', '勝手に動く', '充電式の', '折り畳み式の', '食べられる', '賞味期限切れの',
  '名前入りの', '百年前の', '未来から来た', '拾った', '借り物の', '業務用の',
  '一点物の', 'なぜか温かい',
] as const;
const OBJECT_MODIFIER_EMPTY_PROBABILITY = 0.55;

const DESCRIPTION_ADJECTIVES = [
  '低い', '高い', '長い', '短い', '狭い', '広い', '綺麗な', '汚い',
  '速い', '遅い', '硬い', '柔らかい', '静かな', 'うるさい', '小さい', '大きい',
  '明るい', '暗い', '重い', '軽い', '熱い', '冷たい', '厚い', '薄い',
  '太い', '細い', '深い', '浅い', '丸い', '四角い', '鋭い', '鈍い',
  '派手な', '地味な', '豪華な', '質素な', '丈夫な', '壊れやすい', '古い', '新しい',
  '怖い', '優しい', '怪しい', '便利な', '不便な', '元気な', '眠そうな', '珍しい',
  '普通の', '独特な',
] as const;

const DESCRIPTION_NOUNS = [
  '山', '天井', 'ハードル', '声', '目標', 'プリン', '自転車', 'おにぎり', 'ベンチ', '帽子',
  '会議', '廊下', '自己紹介', '信号待ち', '前置き', '映画', '夏休み', 'エスカレーター', '昼休み', '手紙',
  '部屋', '公園', '改札', '歩道', '舞台', '玄関', '机', 'ベランダ', '本棚', '自転車置き場',
  '人', '字', '寝癖', 'レシート', '水たまり', '空', '雪だるま', '鏡', '白シャツ', '雲',
  '散歩', '昼寝', '食事', 'エレベーター', '拍手', '目覚まし', '返信', 'ジェットコースター', '枕', 'パン',
  'ソファ', 'たこ焼き', '階段', '信号機', '校舎', '花火大会', '運動会', 'ライブ会場', '工事現場', '商店街',
  '図書館', '雪', '写真', '冷蔵庫', '富士山', '体育館', '観覧車', '空港', 'デパート', '消しゴム',
  '目薬', '付箋', '飴', 'イヤホン',
  '駅', 'トンネル', '橋', '道路', '交差点', 'バス停', '駐車場', '屋上', '地下室', '台所',
  '風呂場', '窓', 'ドア', 'カーテン', 'じゅうたん', '電子レンジ', '洗濯機', '掃除機', '扇風機', 'エアコン',
  'テレビ', 'リモコン', 'スマートフォン', 'パソコン', 'キーボード', 'マウス', '鉛筆', 'ノート', '教科書', '辞書',
  '黒板', 'ランドセル', '傘', '靴', '靴下', 'Tシャツ', 'コート', 'メガネ', '腕時計', 'コップ',
  '皿', '箸', 'スプーン', '鍋', 'フライパン', '包丁', 'トースト', 'カレー', 'ラーメン', '寿司',
  'ケーキ', 'アイス', 'りんご', 'バナナ', 'トマト', '大根', '犬', '猫', 'パンダ', 'ペンギン',
  'キリン', '象', 'カラス', '金魚', 'カブトムシ', '太陽', '月', '星', '虹', '風',
  '雨', '台風', '雷', '砂漠', '宇宙船', 'ロボット', '夢', '影', '休日', '宿題',
] as const;

const DESCRIPTION_MODIFIERS = [
  '世界一', '町で一番', '想像以上に', '妙に', 'やけに', 'びっくりするほど',
  '誰よりも', '見たことがないほど', 'ちょっとだけ', 'ほぼ限界まで', 'なぜか', '昔から',
  '今日に限って', '急に', '安定して', '無駄に', '絶妙に', '地味に',
  '圧倒的に', '信じられないほど',
  'めちゃくちゃ', 'かなり', 'ほんの少し', '思ったより', '予想に反して', 'やたら',
  'いつ見ても', '朝だけ', '夜になると', '近所で評判の', '誰もが認める', '一周回って',
  'ギリギリ', 'ほとんど', 'まるで冗談みたいに', '理由もなく', '昔に比べて',
  'どこから見ても', '必要以上に', '説明できないほど',
] as const;
const DESCRIPTION_MODIFIER_EMPTY_PROBABILITY = 0.55;

export const ANALOGY_INTENSITY_ADJECTIVE_COUNT = ADJECTIVES.length;
export const ANALOGY_PROMPT_SOURCE_COUNTS = {
  actions: ACTIONS.length,
  objectModifiers: OBJECT_MODIFIERS.length,
  descriptionAdjectives: DESCRIPTION_ADJECTIVES.length,
  descriptionNouns: DESCRIPTION_NOUNS.length,
  descriptionModifiers: DESCRIPTION_MODIFIERS.length,
} as const;
export const ANALOGY_PROMPT_VARIATION_COUNT =
  INTENSITY_MODIFIERS.length * ADJECTIVES.length
  + OBJECTS.length * ACTIONS.length * (OBJECT_MODIFIERS.length + 1)
  + DESCRIPTION_ADJECTIVES.length * DESCRIPTION_NOUNS.length * (DESCRIPTION_MODIFIERS.length + 1);

const sample = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];
const sampleOptional = <T extends string>(items: readonly T[], emptyProbability: number): T | '' => (
  Math.random() < emptyProbability ? '' : sample(items)
);

function createIntensityPrompt(): AnalogyPrompt {
  return {
    kind: 'intensity',
    label: '条件から連想する',
    text: `${sample(INTENSITY_MODIFIERS)}${sample(ADJECTIVES)}`,
  };
}

function createObjectActionPrompt(): AnalogyPrompt {
  return {
    kind: 'object_action',
    label: '動作にツッコむ',
    text: `${sampleOptional(OBJECT_MODIFIERS, OBJECT_MODIFIER_EMPTY_PROBABILITY)}${sample(OBJECTS)}${sample(ACTIONS)}`,
  };
}

function createDescriptionPrompt(): AnalogyPrompt {
  return {
    kind: 'description',
    label: '組み合わせにツッコむ',
    text: `${sampleOptional(DESCRIPTION_MODIFIERS, DESCRIPTION_MODIFIER_EMPTY_PROBABILITY)}${sample(DESCRIPTION_ADJECTIVES)}${sample(DESCRIPTION_NOUNS)}`,
  };
}

const COMBINATION_PROMPT_CREATORS = [createObjectActionPrompt, createDescriptionPrompt] as const;

export function createAssociationPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = createIntensityPrompt();
    if (prompt.text !== previousText) return prompt;
  }
  return createIntensityPrompt();
}

export function createCombinationPrompt(previousText?: string): AnalogyPrompt {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const prompt = sample(COMBINATION_PROMPT_CREATORS)();
    if (prompt.text !== previousText) return prompt;
  }
  return createObjectActionPrompt();
}
