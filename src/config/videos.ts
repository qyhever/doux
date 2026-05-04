type VideoConfigItem = {
  fileName: string;
  videoName: string;
};

export type VideoItem = VideoConfigItem & {
  uri: string;
};

const videoConfigs: VideoConfigItem[] = [
  { fileName: 'a9d922da.mp4', videoName: '太有才了这哥们' },
  { fileName: 'a9d922dc.mp4', videoName: '不要学电影里炒菜，都是假的' },
  { fileName: 'a9d922e1.mp4', videoName: '舔着舔着突然发现不对劲' },
  { fileName: 'a9d9233b.mp4', videoName: '351国道荆州松滋段' },
  { fileName: 'a9d9233f.mp4', videoName: '美洲豹vs凯门鳄' },
  { fileName: 'a9d92409.mp4', videoName: '无骨草鱼杀法 草鱼去骨去刺整个过程。' },
  { fileName: 'acsgldq4ygzl.mp4', videoName: '龙虾锁屏电脑' },
  { fileName: 'd4eqp6p7vmm.mp4', videoName: '臭豆腐超过印度美食' },
  { fileName: 'i8ecwboeoci.mp4', videoName: '这猝不及防的推背感' },
  { fileName: 'j7kaeb6gmk.mp4', videoName: '自己种的蒜苗' },
  { fileName: '1628846678209mp4.mp4', videoName: '印度街头版汉堡这也太独特了' },
  { fileName: '1654937296227mp4.mp4', videoName: '印度街头炒面，一斤面硬生生炒成了六两！' },
  { fileName: '2.mp4', videoName: 'lol觉醒CG动画，艾欧里亚vs偌克萨斯' },
  { fileName: '2013cg.mp4', videoName: '2013年《英雄联盟》CG宣传片「扭曲的命运」AI修复补帧画质增强版' },
  { fileName: '24u7qivyunz.mp4', videoName: '爸爸带着女儿买烧鸡' },
  { fileName: '2hzcohudabj.mp4', videoName: '好久没玩了' },
  { fileName: 'SuratFamousEggRecipe_TikhariOmelette_PintuBhai.mp4', videoName: '你永远不知道印度的鸡蛋到哪一步才可以吃了' },
  { fileName: 'last-night.mp4', videoName: '英雄联盟CG-最后的曙光' },
  { fileName: 'nubg65mfcb.mp4', videoName: '这里是公安县藕池口，为荆江南岸四口之一' },
  { fileName: 'studio_video_1702118321696mp4.mp4', videoName: '艾欧尼亚与诺克萨斯最为惨烈的一场战役' },
  { fileName: 'v28dddg7yvr.mp4', videoName: '黄豆应该是最全面的食物了，让我们来看看都可以做那些食物出来' },
  { fileName: 'vjsab8nx29p.mp4', videoName: '今晚王者荣耀双排' },

  { fileName: 'ios/IMG_5287.mp4', videoName: 'ios/IMG_5287.mp4' },
  { fileName: 'ios/IMG_5288.mp4', videoName: 'ios/IMG_5288.mp4' },
  { fileName: 'ios/IMG_5316.mp4', videoName: 'ios/IMG_5316.mp4' },
  { fileName: 'ios/IMG_5324.mp4', videoName: 'ios/IMG_5324.mp4' },
  { fileName: 'ios/IMG_5343.mp4', videoName: 'ios/IMG_5343.mp4' },
  { fileName: 'ios/IMG_5347.mp4', videoName: 'ios/IMG_5347.mp4' },
  { fileName: 'ios/IMG_5349.mp4', videoName: 'ios/IMG_5349.mp4' },
  { fileName: 'ios/IMG_5354.mp4', videoName: 'ios/IMG_5354.mp4' },
  { fileName: 'ios/IMG_5355.mp4', videoName: 'ios/IMG_5355.mp4' },
  { fileName: 'ios/IMG_5359.mp4', videoName: 'ios/IMG_5359.mp4' },
  { fileName: 'ios/IMG_5394.mp4', videoName: 'ios/IMG_5394.mp4' },
  { fileName: 'ios/IMG_5397.mp4', videoName: 'ios/IMG_5397.mp4' },
  { fileName: 'ios/IMG_5398.mp4', videoName: 'ios/IMG_5398.mp4' },
  { fileName: 'ios/IMG_5399.mp4', videoName: 'ios/IMG_5399.mp4' },
  { fileName: 'ios/IMG_5400.mp4', videoName: 'ios/IMG_5400.mp4' },
];

export const videos: VideoItem[] = videoConfigs.map((item) => {
  return {
    ...item,
    uri: 'https://qyhever.com/videos/' + item.fileName,
  };
});
