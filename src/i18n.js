'use strict';
/* Language, music and sound settings. Every string drawn on the canvas goes through tr(): Chinese is the source text,
   English comes from this table. Lines joined with ' · ' are translated part by part; numbered lines use patterns. */
const Settings = {
  lang: 'zh', music: true, sfx: true,
  load() { const s = store('kk.settings'); if (s) Object.assign(this, s); },
  save() { store('kk.settings', { lang: this.lang, music: this.music, sfx: this.sfx }); },
};
Settings.load();

const EN = {
  // title, menus
  '海妖龙骨': 'KRAKEN KEEL', '启 航': 'SET SAIL', '操作说明': 'Controls', '设置': 'Settings', '按 Enter 开始': 'Press Enter to start',
  '一条长船，一场风暴，一海的敌人。在摇晃的甲板上把登船的海盗打下海，最后面对深渊里睁开的那只眼睛。': 'One longship, one storm, a sea full of enemies. Knock boarders off a rolling deck, and face the eye that opens in the deep.',
  '操作': 'Controls', '知道了': 'Got it', '暂停': 'Paused', '继续': 'Resume', '回到标题': 'Title screen', '再来一次': 'Sail again',
  '语言': 'Language', '音乐': 'Music', '音效': 'Sound effects', '开': 'On', '关': 'Off', '返回': 'Back', '中文': '中文', 'English': 'English',
  '声音开': 'Sound on', '静音': 'Muted',
  // controls
  'A / D': 'A / D', "任何武器满蓄力出招时，Bon 卷起旋风一起冲出去": "On any full-charge attack, Bon rides along as a feather tornado", "第二章 · 冰封北海": "Chapter Two · The Frozen North", "起步资金 700 银、12 个零件：先整备，再起航": "Starting purse: 700 silver and 12 parts. Kit out, then sail", "射": "FIRE", "扎": "BRACE", "攻": "ATK", "滚": "ROLL", "跳": "JUMP", "横屏才能看清整条船": "Landscape shows the whole ship", "请把设备横过来": "Please turn your device sideways", "从第二章开始": "Start at Ch. 2", "左键 快斩 · 按住或右键 冲刺斩 · 空格 跳（可二段跳） · Shift 翻滚": "LMB quick cut · hold / RMB dash cut · Space jump (double jump) · Shift roll", "左键 朝鼠标射击 · 按住或右键 蓄力穿透 · 空格 跳（可二段跳） · Shift 翻滚": "LMB fire at cursor · hold / RMB piercing shot · Space jump (double jump) · Shift roll", "按 Enter 继续": "Press Enter to continue", "新纪录！": "New record!", "新航程": "New voyage", "确定重来？": "Start over?", "继续航行": "Continue", "最快通关": "Best clear", "三连击 · 蓄力横扫 · 击退最强": "3-hit combo · charged sweep · huge knockback", "四连快斩 · 流血 · 蓄力冲刺斩": "4 quick cuts · bleed · charged dash cut", "多一支弩箭，伤害 +20%": "One more bolt, damage +20%", "弯刀伤害 +25%，流血更深": "Cutlass damage +25%, deeper bleeds", "水手弯刀": "Cutlass", "船桨": "Oar", "船桨伤害 +30%": "Oar damage +30%", "远程散射 · 贴脸最痛 · 蓄力穿透": "Ranged spread · brutal up close · charge pierces", "霰弹弩": "Scatterbow", "使用中": "Equipped", "切换已经买下的武器。": "Switch between weapons you own.", "未拥有": "Not owned", "点击装备": "Click to equip", "吃饱了": "Full", "奢侈品：永久拥有，跨局保留。钱多的时候来这里花。鼠标放上去可以先试穿。": "Luxuries: yours forever, across voyages. Somewhere to spend a full purse. Hover to try them on.", "每打一仗 Bon 都会饿一点，饿了出手变慢。吃饱时不肯再吃，所以每仗之后喂一次最划算。": "Every fight makes Bon a little hungrier, and hungry she pecks slower. She refuses food when full, so one meal after each fight is best.", "凤凰": "Phoenix", "凤凰！": "Phoenix!", "啄中的敌人被标记，船长下一击必定暴击": "Pecked foes are marked: the captain's next hit on them always crits", "救援": "Rescue", "救援！": "Rescued!", "标记": "Mark", "满蓄力横扫时，Bon 卷起旋风一起冲出去": "On a full-charge sweep, Bon rides the wind blade as a tornado", "羽旋风": "Feather Tornado", "船长落水时，Bon 把他拽回船上": "When the captain falls in, Bon hauls him back aboard", "船长连击第三下打中时，Bon 一起俯冲": "When the captain's third combo hit lands, Bon dives in too", "连携俯冲": "Team Dive", "连携！": "Team-up!", "雷羽": "Thunder Plume", "雷羽！": "Thunder Plume!", "魔法：化作火凤凰贯穿敌阵；暴击率翻倍": "Magic: bursts into a phoenix and tears through a deck of raiders; crits doubled", "魔法：召来闪电劈中敌人，劈晕周围的人": "Magic: calls down lightning on a foe and dazes everyone near", "一头冰巨魔跳上了船。它砸地会震飞所有人——跳起来躲开。": "An ice troll leaps aboard. Its slam throws everyone — jump to dodge it.", "一整船抱着火药桶的疯子。把他们打回自己船上去炸！": "A ship full of maniacs hugging powder kegs. Knock them back onto their own deck to blow!", "两头冰巨魔，一个鹰猎手。精英敌人。": "Two ice trolls and a falconer. Elite.", "冰上漂来小艇。霜巫会把甲板冻住，站在冰上会打滑。": "Skiffs drift in among the floes. Frost witches glaze the deck; ice is slippery.", "冰封北海": "The Frozen North", "冰巨魔": "Ice Troll", "冰海深处，一条巨龙醒了。": "Deep in the ice sea, a great wyrm wakes.", "冰霜首领": "Frost Jarl", "冻住了！狂按方向键": "Frozen! Mash the keys", "北海的首领带着巨魔、霜巫和火药猴。精英敌人。": "The jarl of the north brings a troll, a witch and a powder monkey. Elite.", "峡湾": "The Fjords", "暴风雪": "Blizzard", "浮冰海峡": "Floe Strait", "火药船": "Powder Ship", "雪崩": "Avalanche", "风雪里什么都看不清。两边都有人。": "Snow everywhere; they're coming from both sides.", "鹰崖": "Hawk Cliffs", "鹰猎手放出海鹰。Bon 会和它们在空中缠斗。": "Falconers loose sea hawks. Bon will duel them in the air.", "嘶——": "Hsss—", "标记暴击": "Marked crit", "受到伤害 -15%": "Damage taken -15%", "暴击 +6%": "Crit +6%", "烤鳕鱼": "Grilled Cod", "生命 +35": "Health +35", "磨利桨刃": "Honed Blade", "等它扑咬、龙头卡在甲板上时，砸它的头": "Wait for its bite to get stuck in the deck, then smash the head", "船体受损 -15%": "Hull damage -15%", "蓄力快 30%": "Charge 30% faster", "铁皮包船": "Iron Plating", "铁盔": "Iron Helm", "雷纹符文": "Thunder Rune", "冰海深处的巨龙。它会缠住整条船。": "A wyrm from the deep ice. It coils around the whole ship.", "拽！": "Yank!", "受伤": "Taken", "暴击": "Crit", "跳跃": "Jump", "伤害": "Damage", "生命": "Health", "冰海平静了": "The Ice Sea Is Still", "合作": "Team", "技能": "Skills", "护具": "Armour", "护具让船长更耐打、跳得更高。": "Armour makes the captain tougher and lets him jump higher.", "武器": "Weapon", "武器让船桨更疼、更容易暴击、蓄力更快。": "Weapons make the oar hit harder, crit more and charge faster.", "海妖沉回了海底。北方的冰海里，传来了龙吟……": "The kraken sinks back into the deep. From the frozen north, a dragon roars…", "点甲板空位建造 · 左边照顾船长和 Bon · 下方修船": "Build on empty deck slots · captain and Bon on the left · ship below", "第一章 完": "Chapter One Complete", "航海图 · 冰封北海": "Sea Chart · The Frozen North", "补给": "Supplies", "补给马上回复生命，可以反复买。": "Supplies heal at once and can be bought again and again.", "装备 · 补给": "Gear · Supplies", "进入第二章 ›": "Chapter Two ›", "重新开始": "Start over", "霜龙沉入冰海。Bon 在桅杆上唱起了歌。": "The frost wyrm sinks into the ice. Bon sings from the masthead.", "魔法": "Magic", "冰海安静了": "The ice sea falls silent", "冰锥从天而降，它会潜到船的另一边": "Icicles rain down; it dives under to the other side", "它缠住了船！砸碎发光的鳞片！": "It has the ship! Smash the glowing scales!", "血色极光": "Blood Aurora", "霜龙": "Frost Wyrm", "霜龙坠海": "The Wyrm Falls", "霜龙暴怒": "The Wyrm Rages", "霜龙缠住了整条船": "The wyrm coils around the ship", "霜龙被震晕了！": "The wyrm is stunned!", "鳞片碎了！": "Scale shattered!", "鳞甲太硬": "Too armoured", "龙头卡住了！快打！": "Its head is stuck! Hit it!", "海盗帽": "Tricorn", "维京角盔": "Viking Helm", "小王冠": "Little Crown", "小花": "Flower", "草帽": "Straw Hat", "海蓝围巾": "Sea Scarf", "领结": "Bow Tie", "金项链": "Gold Chain", "紫斗篷": "Purple Cape", "眼罩": "Eyepatch", "葵花籽": "Sunflower Seeds", "芒果干": "Dried Mango", "蜜饼": "Honey Cake", "铁爪": "Iron Talons", "羽翼护环": "Wing Rings", "幸运铃铛": "Lucky Bell", "啄击伤害 +35%": "Peck damage +35%", "飞得更快，出手间隔 -18%": "Flies faster, attacks 18% more often", "暴击 +8%，啄中时会叼回银币": "Crit +8%, sometimes snatches silver", "眩晕啄": "Daze Peck", "啄中的敌人晕得更久": "Pecked foes stay dazed longer", "双连啄": "Double Peck", "每次俯冲连啄两下": "Pecks twice per dive", "羽刃": "Feather Blades", "盘旋时甩出三片羽刃": "Flings three feather blades while circling", "金羽": "Golden Plumes", "暴击率翻倍，浑身发金光": "Double crit chance, golden glow", "喂食": "Feed", "装备": "Gear", "衣橱": "Wardrobe", "饱食": "Belly", "饿了": "Hungry", "饿…": "Hungry…", "饿了：出手变慢、伤害降低": "Hungry: slower, weaker pecks", "经验 已满级": "XP: max level", "饱食 回满": "Belly: full", "帽子": "Hats", "衣服": "Outfits", "不戴": "None", "不穿": "None", "穿着": "Wearing", "拥有": "Owned", "点击照顾 Bon": "Click to look after Bon", "每打一仗 Bon 都会饿一点。饿了她出手变慢、伤害降低。喂她还能攒经验升级。": "Every fight makes Bon a little hungrier. Hungry, she pecks slower and softer. Feeding her also earns XP.", "装备用零件打造，永久保留。": "Gear is built from parts and kept forever.", "衣服和帽子买过就一直留着。把鼠标放上去可以先试穿。": "Hats and outfits are yours to keep. Hover to try them on.", "嘎！": "Squawk!", "嘎？": "Squawk?", "嘎嘎！": "Squawk squawk!", "好吃！": "Yum!", "还要！": "More!", "闪亮亮！": "Shiny!", "好看吗？": "Pretty?", "嘎～": "Squaaawk~", "帅不帅？": "Dashing?", "嘎。": "Squawk.", '船员把你接回了船上': 'The crew brings you back aboard', '不会受伤。游到船边按左右就能爬上船，也可以按空格跳出水面。': 'No harm done. Swim into a hull to climb aboard, or press Space to leap out.', '空格 跳出水面 · 游向船边爬上去': 'Space to leap out · swim into a hull to climb aboard', '空格 / W': 'Space / W', '在水里': 'In water', '左键': 'LMB', '按住左键': 'Hold LMB', 'S': 'S', 'Shift': 'Shift', 'E': 'E', 'Esc / M': 'Esc / M',
  '移动。船随浪倾斜，站不稳会滑。': 'Move. The deck rolls with the waves; lose your footing and you slide.',
  '跳，按久跳高；空中还能再跳一次。': 'Jump; hold for height. Jump again in mid-air.',
  '不会受伤，按空格直接跳出水面。': 'No harm done. Press Space to leap out.',
  '船桨三连击，第三下把人挑飞。': 'Three-hit oar combo; the third launches them.',
  '蓄力横扫，蓄满能直接扫下船。': 'Charged sweep; at full charge it clears the deck.',
  '扎稳脚跟：不滑，挨打退得少；能挡住钩手。': 'Brace: no sliding, less knockback, beats hooks.',
  '翻滚，短暂无敌。': 'Roll, briefly invulnerable.',
  '操作弩炮、补破洞、点燃火盆。': 'Man a ballista, patch a hole, light a brazier.', '补破洞、点燃火盆。弩炮会自己开火。': 'Patch holes, light braziers. Ballistas fire on their own.', '自动射击敌船、小艇、触手和海妖的眼睛。': 'Fires on its own at ships, skiffs, tentacles and the kraken\'s eye.',
  '暂停 / 静音。': 'Pause / mute.',
  '敌人挨打越多飞得越远。二段跳能跳上敌船；零件箱游过去就能捡。': 'The more hits they take, the further they fly. Double-jump to board; swim to crates.', '敌人挨打越多飞得越远。二段跳能跳上敌船；击沉敌船掉的零件自动收进船舱。': 'The more hits they take, the further they fly. Double-jump to board; salvaged parts are collected automatically.',
  // hud and hints
  '船长': 'Captain', '船体': 'Hull', '风': 'Wind', '连击': 'COMBO', '修整': 'Refit', '海妖': 'Kraken', '首领': 'Chief',
  '左键 挥桨': 'LMB swing', '按住蓄力': 'hold to charge', '按住或右键 蓄力': 'hold / RMB to charge', '按住左键 / 右键': 'Hold LMB / RMB', '蓄力横扫。蓄满时角色发金光，放出去还会甩出一道剑气。': 'Charged sweep. At full charge you glow gold and the swing throws a blade of wind.', '空格 跳（可二段跳）': 'Space jump (double jump)', 'Shift 翻滚': 'Shift roll',
  'A/D 走动': 'A/D walk', '下方升级船长和船': 'upgrade the captain and ship below', '点甲板上的空位建造': 'click an empty deck slot to build', '点甲板上的虚线框建造模块': 'click a dashed deck slot to build',
  '按 E 操作弩炮': 'Press E to man the ballista', '按 E 点燃火盆': 'Press E to light the brazier', '按住 E 修补破洞': 'Hold E to patch the hole',
  '空格 跳出水面': 'Space to leap out', '站过去按住 E': 'stand on it and hold E',
  '瞄准：鼠标': 'Aim: mouse', '按住左键蓄力，松开发射': 'hold LMB to draw, release to fire', 'E 离开': 'E to leave',
  // route
  '最后一程': 'The last leg', '风浪': 'Seas', '决战': 'Final battle',
  '峡湾口': 'Fjord Mouth', '海盗划着小艇扑上来。把他们打下海。': 'Raiders row in on skiffs. Knock them into the sea.',
  '红帆长船': 'The Red Sail', '一条敌船靠上来了。砍断它的桅杆，或者用弩炮击沉它。': 'A longship pulls alongside. Cut its mast, or sink it with the ballista.',
  '风暴航道': 'Storm Lane', '闪电、巨浪。海底有东西醒了。': 'Lightning and heavy seas. Something below has woken.',
  '触手巢': 'The Nest', '一片翻涌的黑水。触手会拍向黑暗的地方，溺尸从水里爬上来。': 'Churning black water. Tentacles strike where it is dark; the drowned climb aboard.',
  '夹击': 'Pincer', '首领的长船从一侧逼近，小艇从另一侧包抄。当心钩手。': "The chief's longship closes on one side, skiffs on the other. Watch for hooks.",
  '幽灵船': 'Ghost Ship', '雾里驶来一条没有活人的船。亡灵怕火光。': 'A ship with no living crew comes out of the fog. The dead fear firelight.',
  '狂战士': 'Berserkers', '不要命的家伙们冲过来，后面是首领的船，带着火罐和钩子。': "Fearless men charge in; behind them, the chief's ship with firepots and hooks.",
  '深渊睁开了眼睛。趁它睁眼时攻击。': 'The deep opens its eye. Strike while it is open.',
  // refit
  '铁箍船桨': 'Iron-bound Oar', '伤害 +30%': 'Damage +30%', '海豹皮靴': 'Sealskin Boots', '跳得更高': 'Jump higher',
  '熊皮大衣': 'Bearskin Coat', '生命 +40': 'Health +40', '一角蜜酒': 'Horn of Mead', '回满生命': 'Full health',
  '补船': 'Patch the Hull', '船体 +80 补洞': 'Hull +80, holes fixed', '加固龙骨': 'Reinforced Keel', '船体上限 +80': 'Max hull +80', '已满': 'Maxed',
  '起 航 ›': 'SAIL ›', '修整 · 点甲板上的虚线框建造模块': 'Refit · click a dashed deck slot to build',
  '弩炮': 'Ballista', '盾墙': 'Shield Wall', '火盆': 'Brazier',
  '自动射击敌船、小艇和触手。按 E 亲手瞄准。': 'Fires at ships, skiffs and tentacles. Press E to aim it yourself.',
  '拦住敌人，也挡飞斧和触手。': 'Stops boarders, blocks axes and tentacles.',
  '光里的敌人更怕打，亡灵变慢，触手避开火光。': 'Foes in its light take more damage; the dead slow down; tentacles avoid it.',
  '铁弓臂': 'Iron Arms', '伤害 +40%': 'Damage +40%', '绞盘': 'Winch', '装填快 35%': 'Reload 35% faster', '双矢': 'Twin Bolts', '一次射出两支弩箭': 'Fires two bolts at once',
  '火油箭': 'Fire Bolts', '点燃敌人和敌船，烧触手更狠': 'Sets foes and ships alight; burns tentacles',
  '鱼叉箭': 'Harpoon', '射中的人被拽进海里，敌船被拖近': 'Drags men into the sea, pulls ships closer',
  '修理': 'Repair', '拆掉': 'Dismantle', '点燃': 'Light', '让火盆重新亮起来': 'Relight the brazier',
  // banners and combat text
  '海面平静了': 'The sea is calm', '修整你的船': 'Refit your ship', '龙骨断了': 'The keel is broken', '船沉入了海底': 'The ship goes down',
  '深渊安静了': 'The deep is quiet', '海妖沉回了海底': 'The kraken sinks back into the dark', '你的长船穿过了风暴，海妖沉回了海底。': 'Your longship came through the storm and the kraken sank back into the deep.',
  '敌船沉了！': 'Ship sunk!', '桅杆断了！': 'Mast down!', '敌船失去了动力': 'The enemy ship is dead in the water',
  '敌船被清空了': 'Ship cleared', '跳进海里捞漂着的零件箱': 'Jump in and grab the floating crates', '零件自动收进船舱': 'Parts go straight into the hold',
  '首领倒下了': 'The chief falls', '海妖暴怒': 'The kraken rages', '它缠住了船体，砍断触手让船回正': 'It has the hull; cut the tentacles to right the ship',
  '墨潮': 'Ink Tide', '一片漆黑，只有火盆和它的眼睛在发光': 'Pitch dark: only the braziers and its eye glow',
  '它抓住了船！': 'It has the ship!', '砍断缠住船首和船尾的触手': 'Cut the tentacles at bow and stern',
  '趁它睁眼时用弩炮射它，或者二段跳上去砸它的眼睛': 'When the eye opens, shoot it, or double-jump and smash it', '弩炮会在它睁眼时射它；二段跳上去砸它的眼睛伤害更高': 'Ballistas shoot the eye when it opens; double-jump up and smash it for more',
  '眼睛睁开了': 'The eye opens', '勾住了眼睛！': 'Hooked the eye!',
  '落水！': 'OVERBOARD!', '格挡': 'Blocked', '破防': 'Guard broken', '扎稳了！': 'Braced!', '被钩住了！': 'Hooked!', '鱼叉！': 'Harpooned!',
  '扑灭': 'Put out', '船长倒下': 'Captain down', '重新站起': 'Back up', '补好了 +10': 'Patched +10', '船员把你拉了上来': 'The crew hauled you in',
  '火盆灭了': 'Brazier out', '按 E 重新点燃': 'press E to relight',
  // sea chart and events
  '航海图': 'Sea Chart', '选择下一个目的地': 'Choose the next destination', '起航……': 'Under way…', '迎战': 'Fight', '商店八折': 'Shop 20% off',
  '战斗': 'Fight', '精英': 'Elite', '沉船残骸': 'Wreck', '港口': 'Harbour', '迷雾': 'Fog',
  '一场遭遇战。': 'An encounter at sea.', '首领坐镇的长船。难打，奖励丰厚，必掉零件。': "A chieftain's longship. Hard, well paid, always drops parts.",
  '不用打仗。捞起漂在海上的零件和银币。': 'No fighting. Fish parts and silver out of the sea.', '免费补船、回满生命，港口商店打八折。': 'Free repairs, full health, and the harbour shop is 20% off.',
  '雾里看不清：可能是宝藏，也可能是埋伏。': 'You cannot see through the fog: treasure, or an ambush.', '深渊里的那只眼睛。': 'The eye in the deep.',
  '一条沉船的残骸在浪里打转。船员跳下去，捞起了零件和银币。': 'A wreck turns in the swell. The crew dives in and brings up parts and silver.',
  '峡湾里的小港口。木匠补好了船，你也喝上了热汤。港口商店打八折。': 'A small harbour in the fjord. The carpenter mends the ship and you get a hot meal. The shop is 20% off.',
  '雾散开时，你们撞上了一条被遗弃的货船，舱里还有东西。': 'As the fog lifts you find an abandoned trader, and its hold is not empty.',
  '是埋伏！小艇从雾里冲了出来。': 'Ambush! Skiffs burst out of the fog.',
  '雾里传来歌声。船员们说那是好兆头：船长的生命上限 +20。': 'Singing drifts out of the fog. The crew call it a good omen: max health +20.',
  // end
  '击倒': 'Downed', '打下海': 'Overboard', '击沉敌船': 'Ships sunk', '砍断触手': 'Tentacles cut', '用时': 'Time',
};
const EN_PATTERNS = [
  [/^第 (\d+) 程 \/ 共 (\d+) 程$/, 'Leg $1 of $2'],
  [/^奖励 (\d+)$/, 'Reward $1'],
  [/^暴击 (\d+)$/, 'CRIT $1'],
  [/^升级 (\d+)$/, 'Upgrade $1'],
  [/^第 (\d+) 章$/, 'Chapter $1'],
  [/^第 (\d+) 程$/, 'Leg $1'],
  [/^第一章 (.+)$/, 'Chapter 1 $1'],
  [/^全部 (.+)$/, 'Full run $1'],
  [/^阶段 (\d+)$/, 'Phase $1'],
  [/^你撑到了第 (\d+) 章第 (\d+) 程。$/, 'You made it to chapter $1, leg $2.'],
  [/^Bon 升级！Lv (\d+)$/, 'Bon leveled up! Lv $1'],
  [/^Bon 学会了「(.+)」$/, (m, n) => `Bon learned ${tr(n)}`],
  [/^经验 (\d+)\/(\d+)$/, 'XP $1/$2'],
  [/^经验 \+(\d+)$/, 'XP +$1'],
  [/^饱食 \+(\d+)$/, 'Belly +$1'],
  [/^啄击 (\d+)$/, 'Peck $1'],
  [/^间隔 ([\d.]+) 秒$/, 'every $1s'],
  [/^Lv(\d+) (.+)$/, (m, a, b) => `Lv${a} ${tr(b)}`],
  [/^(\d+) 处破洞在漏水$/, (m, n) => `${n} hole${n > 1 ? 's' : ''} leaking`],
  [/^收回 (\d+) 银$/, 'Refund $1'],
  [/^耐久 (\d+)\/(\d+)$/, 'Durability $1/$2'],
  [/^船员捞起了 (\d+) 个零件$/, 'The crew fished out $1 parts'],
  [/^你撑到了第 (\d+) 程。$/, 'You made it to leg $1.'],
  [/^-(\d+) 银$/, '-$1 silver'],
  [/^(.+)被毁$/, (m, a) => `${tr(a)} destroyed`],
];
function tr(s) {
  if (Settings.lang !== 'en' || s == null) return s;
  s = String(s); if (EN[s] !== undefined) return EN[s];
  if (s.includes(' · ')) return s.split(' · ').map(tr).join(' · ');
  for (const [re, rep] of EN_PATTERNS) if (re.test(s)) return s.replace(re, rep);
  return s;
}
