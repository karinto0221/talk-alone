const TARGET_USERNAME_COUNT = 1_000;

const CURATED_USERNAMES = [
  '匿名ユーザー', '通りすがり', '青いマグカップ', '週末コーヒー', 'ねむたいパンダ',
  'しおむすび', 'みかん箱', '夜更かし中', 'あおぞら', 'ラジオ好き',
  'お茶の時間', '帰宅途中', '白いスニーカー', 'イヤホン片方', 'カレー二日目',
  '北口改札', 'ゆっくり歩く', 'きのこ派', '右きき', 'ふつうの人',
  '今日は晴れ', 'こげぱん', 'まる', '低気圧', '無名のリスナー',
] as const;

const USERNAME_PREFIXES = [
  '青い', '白い', '丸い', '小さな', '静かな', '眠たい', '気ままな', 'のんびり', '無口な', 'ごきげんな',
  '迷子の', '透明な', 'うっかり', 'ゆっくり', 'ひだまりの', '夜更かしの', '低気圧の', '水玉の', '左利きの', '週末の',
  '遠回りの', 'まじめな', '気まぐれな', 'ふつうの', 'こっそり', 'ささやかな', 'ぼんやりした', '朝焼けの', '雨上がりの', '黄昏の',
] as const;

const USERNAME_NOUNS = [
  'マグカップ', 'しおむすび', 'パンダ', 'みかん', 'スニーカー', 'イヤホン', 'カレー', 'プリン', 'こげぱん', 'ペンギン',
  'ラジオ', '急須', '靴下', '文鳥', 'レモン', 'クリームソーダ', '改札', '本棚', '月見うどん', '柴犬',
  '目玉焼き', '金魚', '食パン', '自転車', 'レシート',
] as const;

const SCENE_PREFIXES = [
  '北口にいる', '窓際にいる', '帰宅途中の', '改札前の', '午後三時の',
  '深夜二時の', '冷蔵庫横の', '本棚の隅の', '最後尾の', '信号待ちの',
  '雨宿り中の', 'お昼休みの', '始発待ちの', '散歩途中の', '二度寝した',
  '寝癖のままの', '傘を忘れた', '道に迷った', '今日は休みの', '明日から本気の',
] as const;

const USERNAME_SUFFIXES = [
  '好き', '見習い', '担当', '待機中', '二日目', 'の民',
  'しか勝たん', 'を探しています', 'を忘れた人', 'に詳しくない人', 'で一休み', '派代表',
] as const;

const descriptiveUsernames = USERNAME_PREFIXES.flatMap((prefix) =>
  USERNAME_NOUNS.map((noun) => `${prefix}${noun}`),
);

const sceneUsernames = SCENE_PREFIXES.flatMap((prefix) =>
  USERNAME_NOUNS.map((noun) => `${prefix}${noun}`),
);

const statementUsernames = USERNAME_NOUNS.flatMap((noun) =>
  USERNAME_SUFFIXES.map((suffix) => `${noun}${suffix}`),
);

const interleave = (groups: readonly (readonly string[])[]) => {
  const values: string[] = [];
  const maxLength = Math.max(...groups.map((group) => group.length));
  for (let index = 0; index < maxLength; index += 1) {
    for (const group of groups) {
      const value = group[index];
      if (value) values.push(value);
    }
  }
  return values;
};

export const STREAMER_USERNAMES = [
  ...new Set([
    ...CURATED_USERNAMES,
    ...interleave([descriptiveUsernames, sceneUsernames, statementUsernames]),
  ]),
].slice(0, TARGET_USERNAME_COUNT);

if (STREAMER_USERNAMES.length !== TARGET_USERNAME_COUNT) {
  throw new Error(`Streamer usernames must contain ${TARGET_USERNAME_COUNT} unique entries.`);
}

if (STREAMER_USERNAMES.some((username) => username.length > 20)) {
  throw new Error('Streamer usernames must be 20 characters or fewer.');
}
