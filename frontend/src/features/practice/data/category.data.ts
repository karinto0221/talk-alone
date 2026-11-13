import type { Category } from '../../../domain/practice';

export const CATEGORIES: readonly Category[] = [
  { id: 'daily', name: '日常・暮らし', description: '身近な習慣、食べ物、生活の話題', color: '#38bdf8' },
  { id: 'favorites', name: '好き・苦手', description: '好み、苦手なもの、趣味、こだわり', color: '#818cf8' },
  { id: 'memories', name: '思い出・経験', description: '過去の体験、学び、印象的な出来事', color: '#2dd4bf' },
  { id: 'imagination', name: 'もしも・想像', description: '自由な発想で考える仮定の話題', color: '#a78bfa' },
  { id: 'values', name: '価値観・思考', description: '人生観、選択、考え方を深める話題', color: '#60a5fa' },
  { id: 'society', name: '社会・未来', description: '世の中、技術、これからの暮らし', color: '#22d3ee' },
  { id: 'work_learning', name: '仕事・学び', description: '仕事、キャリア、勉強、成長に関する話題', color: '#4f8cff' },
  { id: 'relationships', name: '人間関係', description: '家族、友人、対話、信頼に関する話題', color: '#67a3ff' },
  { id: 'entertainment_culture', name: 'エンタメ・文化', description: '映画、音楽、本、ゲーム、芸術、文化に関する話題', color: '#7c8cff' },
  { id: 'debate', name: '賛否・ディベート', description: '身近なテーマについて賛否と理由を考える話題', color: '#4cb7d8' },
];
