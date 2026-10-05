/* Edition 5 ending presentation: factual outcome first, one grounded closing line.
 * This script only changes ending copy/presentation. The reachable routes, money
 * ledger, dates, and player choices still come from revision.js. */
(() => {
  'use strict';
  const G = window.STORY;
  function splitLast(raw) {
    const text = (Array.isArray(raw) ? raw.join('\n') : String(raw)).trim();
    const clean = text.replace(/[。！？\s]+$/, '');
    const cut = Math.max(clean.lastIndexOf('。'), clean.lastIndexOf('！'), clean.lastIndexOf('？'));
    if (cut < 0) return {body:[text], quote:''};
    return {body:[clean.slice(0,cut+1).trim()], quote:clean.slice(cut+1).trim()+'。'};
  }
  for (const id of G.endings) {
    const n = G.nodes[id], original = n.body;
    if (typeof original === 'function') {
      n.body = s => splitLast(original(s)).body;
      n.quote = s => splitLast(original(s)).quote;
    } else {
      const result = splitLast(original);
      n.body = result.body;
      n.quote = result.quote;
    }
  }
  function set(id,body,quote) {
    G.nodes[id].body = Array.isArray(body) ? body : [body];
    G.nodes[id].quote = quote;
  }
  set('end_noodles','你没有继续升学，和初恋在餐馆打工、一起租房。房间不大，工资只够付眼前的日子。他煮了两碗方便面，把最后一个鸡蛋分给你一半。','这一晚，你终于没有在那个让你害怕的家里睡觉。');
  set('end_home','你和相处了一段时间的伴侣住在一起。两个人都继续上班，分担房租和家务；今天他做饭，明天你早下班。开销记在同一本账上。','房租还是那笔房租，终于不是你一个人的。');
  set('end_wife','你发了伴侣做饭的照片，帖子被转发。陌生人骂你是娇妻，也把你没说过的话安到你身上。你解释过两个人的工作和分工，评论还在增加。','厨房里，他问明天吃什么。手机还在亮。');
  set('end_reception','你继续在洗浴会所做前台，登记、收银、交接夜班，没有转去陪酒接待。新来的问七号柜在哪，你没抬头就答了。','七号柜的钥匙，已经被你拿旧了一圈。');
  set('end_byline','你写工厂生活的作品在刊物发表，有人采访，称你为工人诗人。厂方要求删改，后来通知你不用再到原岗位上班。你开始重新找能付房租的工作。','刊物上的名字，还不能替你付房租。');
  set('end_streamwife','你和直播间常来支持的观众在线下相处、交往，后来结婚。他见过你生病和下播后不想说话的样子，也接受你继续开播。今晚你们一起去买菜。','晚饭不用对着镜头解释。');
  set('end_play','你完成付费陪玩订单，按约定时长结算，扣除费用后拿到120元。耳机摘下来，房间安静了。你看了一眼明天还能接单的时间。','游戏结束了，你的班表还没结束。');
  set('end_passenger','你和大学时认识、家境富裕的男生交往。他送你去上班，也愿意听你谈工作。你仍保留自己的工作和收入；这段关系没有让两个人的经济差距自动消失。','车停了，你拿着自己的工牌下车。');
  const liquidated = G.nodes.end_liquidated;
  liquidated.body = s => s.flags.coin_borrowed
    ? ['你做的比特币合约触发保证金条件，平台强制平仓，这次投入损失了。你为这笔交易另借过钱，借款仍要按约偿还。']
    : ['你做的比特币合约触发保证金条件，平台强制平仓，这次投入损失了。这回没有另外借钱，但生活账户少了原本能动用的这笔钱。'];
  liquidated.quote = s => s.flags.coin_borrowed
    ? '页面里的仓位没有了，还款日期没有跟着消失。'
    : '你关掉交易页面，还得打开下个月的账单。';
  const wedding = G.nodes.end_wedding;
  wedding.body = s => {
    const rows = Array.isArray(s.ledger) ? s.ledger : [];
    const choice = rows.some(t=>t.label==='婚礼借款直接支付家庭缺口（虚构合同）')
      ? '你替家里借了60000元支付婚礼和彩礼缺口。婚礼结束，借款仍在你的名下。'
      : rows.some(t=>t.label==='婚礼及彩礼缺口个人出资')
      ? '你按商量的份额出了3000元，没有为这场婚礼另外借款。'
      : '你重新谈了这次出资，没有为婚礼另外借款。参加婚礼，不等于自动承担全部缺口。';
    return ['弟弟结婚，你回去参加婚礼。喜糖塞在包里，亲戚问你什么时候结婚。',choice,`你看了一眼余额：${s.cash.toLocaleString('zh-CN')}元。${s.debt?`全部未还借款${s.debt.toLocaleString('zh-CN')}元。`:'目前没有未还借款。'}`];
  };
  wedding.quote = '喜酒散了，你自己的日子还要接着过。';
  // These are not new branches or rewards. They restore one concrete lived beat
  // before the closing line, so a complete ending page carries its own story.
  const lived = {
    end_noodles:'押金是两个人凑出来的。第二天你们还得早起，去店里接各自的班。',
    end_unfinished:'有人第一次在自己的手机上打开你做的网页。你高兴了一会儿，又发现一个还没修好的地方。',
    end_halfyear:'每次交接往后延，你就把求职消息往后放一点。后来岗位真的不再等你了。',
    end_second_mother:'孩子什么时候午睡、什么时候哭，你比招聘网站的更新时间记得清楚。',
    end_poor:'你关掉视频，房租的扣款提醒还在消息栏里。明天的工作也已经排好了。',
    end_binjiang:'你知道切错一件商品的链接会带来多少售后，交接前又把价格和库存对了一遍。',
    end_home:'谁晚下班，另一个就先把饭煮上。平常的一天，有人知道你几点到家。',
    end_wife:'你删过一条解释，又写了一条。评论里的人没见过那张照片以外的日子。',
    end_normal:'冰箱里留着明天能吃的东西。这不是一个惊人的数字，却让今晚不用再向谁开口。',
    end_reception:'夜班结束前，你照例核一遍收银和柜牌。下一个同事接班时，账目能对上。',
    end_lastnight:'最后一班的工资已经数清，去白班的路线也查好了。离开需要的每一步，你都真的做了。',
    end_beyond:'第一回拿到比前台多的收入，你确实松了一口气。后来你开始按照下一次邀约安排自己的时间。',
    end_young:'宿舍床位分好了，饭卡也能刷。学校那边原本要上的课，没人再替你排。',
    end_award:'老师把获奖照片发进群里。你先把借来比赛的路费还了，再把奖状收进书包。',
    end_toilet:'那天之前，你试过写消息给老师，又在她回复前删掉。走廊传来敲门声时，隐瞒终于结束了。',
    end_model:'等兼职消息的几个周末，你把通知声音开着，后来还是回去排了原来的班。',
    end_billiards:'你学会了摆球、陪练，也学会了在一整晚里接住别人的目光。下班后球台终于安静。',
    end_cyber:'第一笔付款和约定的照片都是真的。新消息越过约定以后，你停在了已经答应的范围内。',
    end_writing:'宿舍熄灯后，车间的声音还在耳边。你把白天没地方说的几句话写进本子。',
    end_byline:'采访来得快，岗位通知也来得快。寄出下一份简历时，刊物还在你的包里。',
    end_sign:'这笔合作报酬是真的，第二天的班也是真的。海报上的署名和工位上的名字，都是你。',
    end_market:'摊位收起后，你还要把空筐搬回去。八十五元是扣完今天费用真正留下的钱。',
    end_factory:'换班铃响，新人把这一件做完了。传送带还在走，下一个工位已经有活。',
    end_tea:'带新人要花时间，缺人又得自己顶上。工资涨了，手机里的排班消息也多了。',
    end_car:'车停着也有账要算：修车单在手边，车贷的日期在日历里。你又打开接单页面看了一眼。',
    end_daughter:'家里供吃住不是没有条件，洗衣做饭也填不进工作年限。你把下一次考试日期圈了起来。',
    end_withdraw:'转回来的钱能付房租；屏幕上后来涨起的部分，没有进你的账户。',
    end_liquidated:'强平通知没有等你同意。你核了交易记录，知道这不是把手机关掉就能撤回的一笔。',
    end_ecomdebt:'退回的货要找地方放，供货款却不能跟着库存一起等。你又把到账日和还款日对了一遍。',
    end_stream:'下播以后，你照着回放改明天的提纲。直播间能留下人，也要有人一场一场准备。',
    end_streamwife:'他知道你生病时不想说话的样子。这次你不需要把每件事都说成一场直播。',
    end_laststream:'新的班次也要早起。至少今晚，设备收起来后，手机不必再对着你。',
    end_single:'住处钥匙在手，眼前的账也由你自己付。下一段关系要不要开始，可以以后再说。',
    end_trainer:'第一次有人不是来听你播，而是来问你怎么播。你把自己踩过的坑写进了她的提纲。',
    end_passenger:'第一次坐上他的车时，你也想过日子会不会从此容易些。交往以后，你仍按自己的班表上班。',
    end_returned:'原先算好的出发时间被改了。你重新核对文件上的名字、日期和雇佣条件。',
    end_abroad:'住处到工作地的路，你走了几次才记住。家里的消息常在另一个作息里到达。',
    end_micro:'一开始赚到的三十元是真的，后来花钱拿货也是真的。中考不会等你卖完最后一件。',
    end_play:'一局接着一局，时间按约定结算。拿到这笔钱以后，你开始算明天还能接多久。',
    end_small:'赚得不多，但这一次你不用为六十元材料费编一个理由打电话回家。',
    end_lastbox:'售后和供货都结清之后，你关掉补货页面。屋里终于有一块地方可以不放箱子。',
    end_exam:'你把原岗位的事交接完，才拿着材料去报到。旧工牌还在包里，新单位的门刚开。',
    end_badges:'他说自己未婚时，你没有只凭那句话放心；核过以后，你们才商量房租和家务。',
    end_lock:'押金是自己付的。搬家那天，行李箱合不上，你还是把门锁装好了。',
    end_bed:'你不是不知道他说过谎，只是明天的班和今晚的住处都在这里。这个早晨照常开始。',
    end_guestlist:'熟客会叫你的名字，排班的人也会。下个月的房租，开始要靠下一次场次来算。',
    end_afterparty:'你没有突然换掉所有联系方式，只是停止回复新的日期。白班的地址已经存在手机里。'
  };
  for (const [id,line] of Object.entries(lived)) {
    const n=G.nodes[id],old=n.body;
    n.body=typeof old==='function'?s=>[...old(s),line]:[...old,line];
  }
  // A second beat is used only where the object in the painting can carry it;
  // the sharp, already-complete endings retain a single closing sentence.
  const echo = {
    end_noodles:'两只纸碗很轻，却把这个夜晚留了下来。',
    end_unfinished:'以前，你一直在别人给的选项里选。后来，你开始自己做按钮。',
    end_halfyear:'那条消息没有骗人，只是没人替它定一个到期日。',
    end_second_mother:'孩子喊你时，从来没觉得那几年是空的。',
    end_poor:'屏幕让你先爱自己，排班表请你明早准时到岗。',
    end_home:'同一本账上，终于有了两个人的笔迹。',
    end_reception:'这份熟悉，是一个夜班一个夜班攒出来的。',
    end_beyond:'柜台后的位置空出来，你的日历却先被填满。',
    end_award:'奖状压在那些练坏的作品上，纸终于不只用来催你交钱。',
    end_toilet:'那张桌子原本只需要等你下节课回来。',
    end_cyber:'已收款和未读消息，就这样并排留在屏幕上。',
    end_byline:'你把那本刊物带上了下一趟求职的车。',
    end_sign:'墙上的诗抬得很高，闸机只认那张旧卡。',
    end_factory:'你已熟练到能教别人，换班铃却不会为此慢下来。',
    end_tea:'工资涨了，缺的那个人也常常写着你的名字。',
    end_car:'车可以停一天，月供不会请假。',
    end_withdraw:'没有进到账户的涨幅，不是今天的房租。',
    end_liquidated:'一个数字归零，另一个按月出现。',
    end_ecomdebt:'营业额挂在屏幕上，钱却卡在退回来的箱子里。',
    end_streamwife:'有人和你走进菜市场，比一屏礼物更像日子。',
    end_laststream:'下一份班不轻松，今晚却不必再对镜头保持笑容。',
    end_wedding:'别人收起红椅套，你还得把自己的账一笔笔算清。',
    end_trainer:'这一次，能把话接下去的人不止你一个。',
    end_passenger:'这段关系是真的，打卡机也是真的。',
    end_micro:'你把亏的四元写在账上，也把考试日期写回墙上。',
    end_play:'屏幕说下一局，你的生活说下一班。',
    end_small:'零钱罐轻了一点，开口求人的日子也少了一回。',
    end_lastbox:'屋里终于有一块地方，不再替生意保管货。',
    end_badges:'一张是他的，一张是你的；没有谁替谁上班。',
    end_lock:'门锁能换，想起那些温柔的时候还要慢慢过去。',
    end_bed:'真相没有消失，只是也要和你们一起起床。',
    end_guestlist:'收入比旧工作高，下一场也就越来越难空出来。',
    end_afterparty:'车窗往前，手机还在身边亮着。'
  };
  for (const [id,line] of Object.entries(echo)) {
    const n=G.nodes[id],old=n.quote;
    n.quote=typeof old==='function'?s=>`${old(s)}\n${line}`:`${old}\n${line}`;
  }
})();
