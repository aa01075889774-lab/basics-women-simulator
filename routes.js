/* Route edition. Fictional money parameters are not market quotations. */
(() => {
  'use strict';
  const legacy=window.STORY, nodes={}, endings=[], H=(s,k)=>!!s.flags[k];
  const C=(label,to,effects={},when=null)=>({label,to,effects,when});
  const N=(id,minYear,role,body,choices,art=8,extra={})=>nodes[id]={id,year:s=>Math.max(s.year,minYear),role,body,choices,art,...extra};
  const E=(id,title,body,art,minYear=2018)=>{endings.push(id);N(id,minYear,'',body,[],art,{ending:true,title});};
  function money(s,cash,debt,label){if(s.cash+cash<0)throw Error('余额不足');s.cash+=cash;s.debt+=debt;if(s.debt<0)throw Error('债务异常');s.ledger.push({year:s.year,label,cash,debt});}
  const pay=(amount,label)=>s=>money(s,-amount,0,label), gain=(amount,label)=>s=>money(s,amount,0,label);
  const mark=(k,v=true)=>s=>{s.flags[k]=v;};
  const both=(...fs)=>s=>fs.forEach(f=>typeof f==='function'?f(s):Object.assign(s.flags,f));
  const afford=n=>s=>s.cash>=n;
  function period(s,months,gross,cost,label){money(s,months*gross,0,`${label} · ${months}个月实得报酬`);money(s,-months*cost,0,`${label} · ${months}个月生活与工作支出`);}
  function apply(s,e){if(typeof e==='function'){e(s);return;}for(const k of ['study','learn','family'])s[k]+=e[k]||0;if(e.cash||e.debt)money(s,e.cash||0,e.debt||0,'选择收支');Object.assign(s.flags,e.flags||{});if(e.wish)s.wishes.push({age:s.year-2003,text:e.wish});}
  const college=s=>H(s,'college')||H(s,'private')||H(s,'university');
  const creative=s=>s.year<=2026&&college(s)&&H(s,'computer')&&H(s,'creator')&&s.learn>=2&&!H(s,'caregiver')&&s.cash>=600;
  const fresh=()=>({edition:3,node:'birth',year:2018,role:'初三',cash:537,debt:0,study:0,learn:0,family:0,flags:{school_rotation:Math.floor(Math.random()*5)},wishes:[],history:[],ledger:[{year:2018,label:'开局已有现金（剧情设定）',cash:537,debt:0}],checkpoints:[]});
  const wish=(text,to)=>C(text,to,{wish:text});

  // The original nine ending identities remain stable for collection migration.
  E('end_noodles','两个人的方便面',['他没有变坏。你们也没有很多钱。','你终于有了一个不会打你的家。'],0,2021);
  E('end_unfinished','还没写完',['你二十三岁。电脑上还有一个没有做完的项目。','明天，你准备继续改。','以前，你一直在别人给的选项里选。后来，你开始自己做按钮。'],1,2026);
  E('end_halfyear','半年',['你本来只准备帮半年。','后来，孩子上幼儿园了。'],2);
  E('end_second_mother','第二个妈妈',s=>[`你${s.year-2003}岁。已经会照顾一个孩子。`,'简历上，工作经验：无。'],3,2021);
  E('end_poor','贫穷的大女主',['手机里的人说，大女主要永远先爱自己。','第二天，六点半。你起床上班。'],4);
  E('end_binjiang','滨江夜班',['凌晨两点，你从公司出来。','你已经很久没向家里要钱。'],5);
  E('end_home','普通人的家',['你们把工资和开销记在同一本账上。','今天他做饭。明天你早下班。'],6);
  E('end_wife','围剿的娇妻',['评论还在增加。','厨房里的人问：“明天还吃这个吗？”'],7);
  E('end_normal','什么也没有发生',s=>['没有巨大灾难。也没有巨大转折。',`${s.year-2003}岁。可用存款${s.cash.toLocaleString('zh-CN')}。`,'今天还是周一。'],8,2033);
  E('end_reception','前台的号码牌',['新来的问你，七号柜在哪里。','你没抬头就答了。'],9);
  E('end_lastnight','最后一个夜班',['闹钟还定在原来的时间。','今晚不用去了。'],10);
  E('end_beyond','前台以外',['这个月的房租交完了。','手机还在响。'],11);
  E('end_young','厂里年纪最小的女孩',['校服放进箱子。新工牌挂在胸前。','下班的时候，学校那边还亮着灯。'],12);
  E('end_award','省赛二等奖',['奖状上，是你的名字。','另一次求职时，它也许能让人多看十秒。'],13);
  E('end_toilet','厕所',['你一直没有告诉任何人。','那天，你请假去了厕所。走廊里响起了敲门声。'],14);
  E('end_model','人生第一本模卡',['照片真的很好看。','工作没有来。'],15);
  E('end_billiards','县城瑜伽裤',['你已经很会跟客人聊天。','下班后，你把球杆放回原来的地方。'],16);
  E('end_cyber','赛博女菩萨',['那个很小的互联网角落，真的给你赚到钱。','你又关掉了一条越界的私信。'],17);
  E('end_writing','下班后',['明天还上班。','今晚又写了一行。'],18);
  E('end_byline','署名',['刊物上印着名字。','厂里收回了工牌。'],19);
  E('end_sign','活字招牌',['厂门口有你的诗。','进去，还要刷卡。'],20);
  E('end_market','赶集',['零钱数了两遍。','菜卖完了。'],21);
  E('end_factory','流水线尽头',['你又教会了一个新来的。','他问，你在这里多久了。'],22);
  E('end_tea','奶茶店店长',['店里缺人。','现在，是你在排班。'],23);
  E('end_car','车贷第十九期',['今天没出车。','扣款短信照常到了。'],24);
  E('end_daughter','全职女儿',['简历空了几年。','下一次报名，家里仍然给你留着房间。'],25);
  E('end_withdraw','提现成功',['钱回到银行卡。','第二天，它又涨了。'],26);
  E('end_liquidated','强制平仓',s=>['仓位消失了。',s.debt?'借的钱还在。':'这次投入的钱，没有回来。'],27);
  E('end_ecomdebt','风口上的债务人',s=>['订单很多。退货也很多。',`你打开账本。未还借款${s.debt.toLocaleString('zh-CN')}。`,'营业额不是能拿走的钱。'],28);
  E('end_stream','主播',['有人给你刷礼物。钱真的到账了。','明天，你还要开播。'],29);
  E('end_streamwife','大哥的老婆',['你们在镜头之外相处了很久。','她觉得现在的生活很好。'],30);
  E('end_laststream','最后一场直播',['灯关了。','今晚，不用再对着镜头说话。'],31);
  E('end_single','不婚',['这些年，你真的留下了一笔钱。','账号关了。婚姻不在今天的计划里。'],32);
  E('end_wedding','你弟弟的婚礼',s=>['婚礼很热闹。',`余额${s.cash.toLocaleString('zh-CN')}。${s.debt?`还有${s.debt.toLocaleString('zh-CN')}未还。`:''}`],33);
  E('end_trainer','镜头后面',['灯亮着。','坐在前面的人换了。'],34);
  E('end_passenger','副驾驶',['车停了。','你还要去上班。'],35);
  E('end_returned','材料退回',['文件退回来了。','你把缺的那项圈了起来。'],36);
  E('end_abroad','那边的早班',['闹钟响了。','家里的消息还没回。'],37);
  E('end_micro','纸箱空了',['箱子空了。','钱还在。中考也快到了。'],38);
  E('end_play','下一局',['耳机摘下来。','刚才那单到账了。'],39);
  E('end_small','零钱罐',['没赚很多。','下一笔费用，你自己交了。'],40);
  E('end_lastbox','最后一箱',['最后一箱发走了。','今天，不补货。'],41);
  E('end_exam','报到那天',['通知上有你的名字。','下周一，报到。'],42);
  E('end_badges','两张工牌',['两张工牌挂在门口。','明天，上不同的班。'],43);
  E('end_lock','新的门锁',['这次留下来的，','是你的那张工牌。'],44);
  E('end_bed','同一张床',['闹钟响了。','谁也没提昨晚的事。'],45);
  E('end_guestlist','名单上的名字',['你把新衣服挂好。','明晚，还要穿。'],46);
  E('end_afterparty','散场以后',['账算过了。','下一场，你没去。'],47);

  N('birth',2018,'初三',['你出生于2003年。山河四省某县城乡镇。','两个姐姐，你，一个弟弟。','父亲酗酒、出轨，也动手。母亲做基础劳动，家里的钱总先给弟弟。'],[C('开始','wish15')],12);
  N('wish15',2018,'初三',['你十五岁。以后想过什么样的日子？'],[wish('有钱','father'),wish('离开这里','father'),wish('有自己的家','father'),wish('不知道','father')],12);
  N('father',2018,'初三',['父亲喝醉了。厨房里有东西摔碎。','弟弟关上门。手机亮了一下。'],[C('给那个男生发消息','noodles',mark('friend')),C('去姐姐那里','sister',mark('sister')),C('躲在房里','school_first'),C('去拦','school_first',mark('intervened'))],12);
  N('noodles',2018,'初三',['只有一包方便面。','他把鸡蛋夹进你的碗里。'],[C('和他在一起','love',mark('love')),C('只做朋友','school_first'),C('以后不打扰他','school_first',mark('friend',false))],0);
  N('love',2019,'初三',['他又陪你走过几次夜路。','“以后我们一起挣钱吧。”'],[C('跟他去县城','love_work',mark('left_school')),C('继续读书','love_study')],0);
  N('love_work',2019,'县城打工',['你们租了一间小屋。他在后厨，你端盘子。','工资到账那天，房租也到期了。'],[C('先这样过','love_years'),C('去别处找工作','job_entry')],0,{enter:s=>period(s,2,2100,1750,'共同打工起步')});
  N('love_years',2021,'县城打工',['你换过工作。他也换过。','那天停电，你们仍一起买菜。'],[C('把碗递给他','end_noodles'),C('去另一座城看看','job_entry')],0,{enter:s=>period(s,12,2500,2200,'共同生活')});
  N('love_study',2019,'初三',['你还是去上课。他没拦你。','家里翻过一次你的手机。'],[C('找老师和姐姐商量，保住学业','school_first',mark('teacher_help')),C('家里坚持让我出去挣钱','forced_factory',mark('left_school'))],12);
  N('forced_factory',2019,'离校找工作',['这不是跟他一起去县城的计划。','你去问招聘。书包还在家里。'],[C('去厂里','factory_entry'),C('问普通服务业','service_entry')],12);
  N('sister',2018,'姐姐家',['姐姐热了一碗饭。明天她还要早班。','“住可以，我养不起闲人。”'],[C('住一晚，明天去学校','school_first',{flags:{sister_short:true}}),C('我想长期留下','sister_stay',{flags:{settled_sister:true,left_school:true}}),C('还是回去','school_first')],3);
  N('sister_stay',2019,'姐姐家的帮手',['做饭、洗衣、买菜。','后来姐姐结婚，折叠床挪到了鞋柜边。'],[C('继续帮她','sister_child'),C('我也要去挣钱','service_entry'),C('我不想天天干这些','sister_out')],3);
  N('sister_child',2021,'姐姐家的帮手',['孩子半夜哭，你比姐姐先醒。','她没多久又回去上班。'],[C('继续照顾','end_second_mother',mark('caregiver')),C('请姐姐介绍工作','front_start'),C('搬出去找工作','job_entry')],3);
  N('sister_out',2019,'找住处',['“我自己都活不下去了。”','你提着袋子，在路边看招聘纸。'],[C('找普通工作','service_entry',mark('sister_strained')),C('先回父母家','service_entry',mark('family_return')),C('给男生发消息','love_work',{},s=>H(s,'friend'))],10);

  const schoolScenes=['period_need','canteen_small','glasses_tape','phone_crack','uniform_small'];
  N('school_first',2018,'初三',['早读铃响了。','这几个月，学校和家里的小事交替发生。'],[C('去上课','school_pool'),C('我现在就要去挣钱','factory_early',mark('left_school'))],12);
  N('factory_early',2018,'十五岁／非法用工情境',['招工表上的年龄，不是你的年龄。','有人没有核清，就让你进了车间。这不意味着用工合法。'],[C('面对这段已发生的工作','factory_entry'),C('离开这里，去找现实支持','sister',mark('sister'))],12);
  N('school_pool',2018,'初三',[],[],12,{route:s=>{const list=[...schoolScenes.slice(s.flags.school_rotation||0),...schoolScenes.slice(0,s.flags.school_rotation||0)];return list.filter(id=>s.history.includes(id)).length>=2?'money':list.find(id=>!s.history.includes(id));},targets:[...schoolScenes,'money']});
  N('period_need',2018,'初三',['月经来了。书包里没有卫生巾。','小卖部还没开门。'],[C('问同桌借一片','school_pool',mark('classmate')),C('去问女老师','school_pool',mark('teacher_help')),C('给姐姐发消息','school_pool',{},s=>H(s,'sister')&&!H(s,'sister_strained')),C('课后再去买','school_pool',pay(8,'月经用品'))],3);
  N('canteen_small',2018,'初三',['饭卡只剩三块七。','你站在窗口看了一会儿。'],[C('买最便宜的那份','school_pool'),C('向同学借一点','school_pool',s=>money(s,10,10,'向同学借饭钱')),C('先回教室','school_pool')],0);
  N('glasses_tape',2018,'初三',['眼镜腿断了。胶带绕了两圈。','黑板左边有点模糊。'],[C('先这样戴','school_pool',mark('broken_glasses')),C('去问维修价','school_pool',{learn:1}),C('问老师能否坐前排','school_pool',mark('teacher_help'))],12);
  N('phone_crack',2018,'初三',['手机屏裂了。','班群的通知昨晚才看清。'],[C('借同学手机看通知','school_pool',mark('classmate')),C('自己去问老师','school_pool',{learn:1}),C('先放着','school_pool')],17);
  N('uniform_small',2018,'初三',['校服小了。袖口洗了很多次。','牙也疼了几天。'],[C('问有没有旧校服','school_pool',mark('teacher_help')),C('把牙疼告诉姐姐','school_pool',{},s=>H(s,'sister')),C('先把今天的课上完','school_pool')],12);
  N('money',2018,'初三',['过年留下的五百块还在。','学校又要交钱。弟弟最近也要补课。','“你是姐姐。”'],[C('给弟弟五百','income',{cash:-500,family:1,flags:{gave500:true}},afford(500)),C('藏进旧棉袄','income',both(pay(500,'现金转存旧棉袄'),mark('stash')),afford(500)),C('先留自己的费用','income',mark('boundary')),C('问姐姐能否借一点','income',s=>money(s,300,300,'向姐姐借款'),s=>H(s,'sister'))],33);
  N('income',2018,'初三',['QQ空间有人说，学生也能做代理。','班群里还有一单五块的任务。'],[C('问问代理','micro'),C('试一单任务','scam_first'),C('周末端盘子','exam_entry',{cash:120,study:-1}),C('先查不会的题','exam_entry',{learn:1,study:1})],38);
  N('micro',2018,'初三',['你发了几条动态，真的卖掉两单。','提成三十。她说升级以后更赚。'],[C('到这里为止','exam_entry'),C('交399做代理','micro_stock',pay(399,'代理入门费用'),afford(399)),C('交1999升级','micro_stock',pay(1999,'代理升级费用'),afford(1999)),C('再卖两单，不拿库存','micro_small')],38,{enter:gain(30,'真实销售提成')});
  N('micro_small',2019,'初三',['顾客收了货。款也结了。','你没答应更大的进货单。'],[C('这笔小钱先留下','end_micro'),C('继续准备中考','exam_entry',{study:1})],38,{enter:gain(90,'小批销售净收入')});
  N('micro_stock',2019,'初三',['箱子到了。朋友后来不太回你的消息。','下一次升级费又来了。中考也快到了。'],[C('先卖掉已有的','micro_clear'),C('不再拿货，认下已付的成本','exam_entry',mark('scammed'))],38);
  N('micro_clear',2019,'初三',['降了一点价格。货总算慢慢出了。','回款不等于全部利润。'],[C('不补货，回去考试','exam_entry'),C('记下这段小生意','end_micro')],38,{enter:gain(460,'现存货物清理回款')});
  N('scam_first',2018,'初三',['第一单五块，第二单十二块。都到账。','第三单要先垫398。'],[C('垫398','scam_locked',pay(398,'任务垫付损失'),afford(398)),C('先退出','exam_entry',mark('risk'))],17,{enter:gain(17,'前两单返款')});
  N('scam_locked',2018,'初三',['任务完成。钱却提不出来。','对方又发来一张垫付单。'],[C('认亏，留记录','exam_entry',mark('scammed')),C('再补一单','scam_gone',pay(100,'追加垫付损失'),afford(100)),C('找姐姐商量','exam_entry',mark('scammed'),s=>H(s,'sister'))],17);
  N('scam_gone',2019,'初三',['头像灰了。钱没有回来。','你留下聊天记录。'],[C('先回学校','exam_entry',mark('scammed'))],17);
  N('exam_entry',2019,'初中毕业',['成绩出来了。通知纸上写着材料和费用。','你把能走的路列了一遍。'],[C('去普高','high_start',{flags:{high:true}},s=>!H(s,'settled_sister')),C('去中专','voc_start',{flags:{voc:true}},s=>!H(s,'settled_sister')),C('直接工作','job_entry',mark('left_school')),C('看看购物车里的口红','lipstick')],12);
  N('lipstick',2019,'初中毕业',['圣罗兰，398。你看了三天。','这只是你想买的一样东西。'],[C('买一支','admission_pick',pay(398,'口红消费'),afford(398)),C('留在购物车','admission_pick',mark('cart'))],40);
  N('admission_pick',2019,'初中毕业',['录取和报名要办的事还在那里。'],[C('去普高','high_start',mark('high'),s=>!H(s,'settled_sister')),C('去中专','voc_start',mark('voc'),s=>!H(s,'settled_sister')),C('先工作','job_entry')],12);

  N('voc_start',2019,'中专',['电商、计算机、护理、幼师、会计、美容、乘务、机电。','招生时都说好就业。开学以后，课表不完全一样。'],[C('电商／会计','voc_life',{flags:{major_business:true}}),C('计算机／机电','voc_life',{learn:1,flags:{major_skill:true}}),C('护理／幼师','voc_life',mark('major_care')),C('美容／乘务','voc_life',mark('major_service'))],13);
  N('voc_life',2020,'中专',['六人寝。有人兼职，有人练比赛。','你这阵子更想试什么？'],[C('跟老师练技能','competition'),C('学长约我看电影','rapper'),C('跟老师做活动和考证','teacher'),C('想想毕业去哪里','voc_exit')],13);
  N('competition',2020,'中专',['搭档想退出。路费还没凑全。','老师说，可以先帮你垫一部分。'],[C('协调训练，去参赛','competition_result',{study:1,flags:{certificate:true}}),C('先去挣钱，下次再试','voc_exit'),C('向老师问升学条件','teacher',{learn:1})],13);
  N('competition_result',2021,'中专',['训练、校赛、市赛。你真的到了省赛。','二等奖。奖状上写着你的名字。'],[C('停在这个时刻','end_award'),C('带着经历继续升学／求职','voc_exit',mark('certificate'))],13);
  N('teacher',2021,'中专',['做PPT、跑办公室。你确实忙。','老师又给了一个岗位推荐和一张收费考证单。'],[C('核岗位与证书用途再决定','voc_exit',{learn:1,flags:{teacher_help:true}}),C('先去看真正的实习岗位','voc_exit'),C('这次只接已经能做的活','voc_exit',{cash:180})],13);
  N('rapper',2020,'中专',['学长会rap，穿得很潮。','“晚上去私人影院吗？”'],[C('去看电影','cinema'),C('带朋友一起','voc_exit'),C('不去','voc_exit')],14);
  N('cinema',2020,'中专',['电影散场。你们又见过几次。','关系要不要继续，仍是你自己的决定。'],[C('继续相处','relationship_info'),C('到这里为止','voc_exit')],14);
  N('relationship_info',2021,'中专',['你们越来越亲近。','你开始找可靠信息，也想知道能向谁开口。'],[C('先把边界和保护问清','voc_exit',{learn:1}),C('关系继续，但一直不敢开口','pregnancy_worry')],14);
  N('pregnancy_worry',2021,'中专',['月经迟了。你不敢告诉家里。','衣服越来越宽。有人问你最近怎么了。'],[C('找老师陪同求助','pregnancy_help',mark('teacher_help')),C('请同学陪我去医疗机构','pregnancy_help',mark('classmate')),C('继续瞒着','pregnancy_hide')],14);
  N('pregnancy_help',2021,'中专',['门开了。有人叫你的名字。','接下来的身体、费用和学业，都有人陪你一起弄清。'],[C('重新安排学业','voc_exit'),C('先找能支持的生活与工作','job_entry')],14);
  N('pregnancy_hide',2021,'中专',['几次机会，你还是没有说。','那天，你一个人离开教室。'],[C('最后向老师开口','pregnancy_help'),C('仍没有告诉任何人','end_toilet')],14);
  N('voc_exit',2022,'中专毕业',['比赛、证书和实习，不是同一张门票。','你先问报名和工作的实际条件。'],[C('单招读专科','college_start',mark('college'),s=>!H(s,'settled_sister')),C('学校安排的工厂实习','factory_entry',mark('student_intern')),C('同学说杭州有岗位','hangzhou'),C('先做普通服务业','service_entry')],13);

  N('high_start',2019,'普高',['别人在补课。你先算费用。','打工能有钱，也要占用时间。'],[C('自己查课和资料','high_pressure',{study:1,learn:1}),C('课余工作，留部分时间学习','high_pressure',{cash:200,study:1}),C('向老师问资助','aid',{learn:1}),C('有人说我适合艺考','art_exam')],12);
  N('aid',2020,'普高',['材料、盖章、提交时间。父亲不愿配合。','老师帮你查可以怎么补齐，资助不是一次点击就到账。'],[C('把能补的材料办完','high_pressure',{flags:{teacher_help:true,aid_info:true},study:1}),C('先保住课和现有收入','high_pressure')],13);
  N('art_exam',2020,'普高',['第一次咨询只写训练费。','摄影、差旅、住宿，还要另算。'],[C('费用和资格核清，小规模试学','art_result'),C('到这里停，回原来的复习','high_pressure',{learn:1})],13);
  N('art_result',2021,'普高',['你试过训练，也查过下一笔钱。','继续需要时间和支持，不只是一句“条件好”。'],[C('有实际支持，继续准备考试','high_exam',{study:1,flags:{art_study:true}}),C('不扩大支出，准备普通高考','high_exam',{learn:1})],13);
  N('high_pressure',2021,'普高',['资料费680。老师又催了一次。','衣服袖口上的白印没洗干净。他当着别人说了一句。','你已经很久没睡好。'],[C('找老师，把费用和学业分开解决','high_exam',{study:1,flags:{teacher_help:true}}),C('已经撑不住，先求助','high_help'),C('离开学校去工作','young_factory',mark('left_school'))],12);
  N('high_help',2021,'暂时休整',['这不是一件事造成的。','有人可以陪你安排休息、求助和接下来的课。'],[C('请老师帮忙联系支持','high_exam',mark('teacher_help')),C('找姐姐商量住处','high_exam',{},s=>H(s,'sister')&&!H(s,'sister_strained')),C('先离开，找实际生活支持','job_entry')],14);
  N('young_factory',2021,'电子厂新人',['书包没再带出来。','你做过交接，领到第一笔工资。晚上学校还亮着灯。'],[C('停在这里','end_young'),C('接着过厂里的生活','factory_life')],12,{enter:s=>period(s,1,3000,2200,'普高离校后的第一个月')});
  N('high_exam',2022,'高考以后',['考试结果、志愿和能否承担费用，是几个不同关口。','资助和工作信息，你也问了一遍。'],[C('专科录取','college_start',mark('college')),C('本科录取','bachelor_offer'),C('落榜，再考一年','repeat'),C('直接找工作','job_entry')],13);
  N('repeat',2023,'复读以后',['又一年的住宿、复习和费用。','这次，你重新填了志愿。'],[C('按结果读专科','college_start',mark('college')),C('有本科录取，核费用','bachelor_offer'),C('不再复读，工作','job_entry')],13);
  N('bachelor_offer',2022,'本科录取',['同样是本科，费用和剩余缺口不同。','公办和民办，都得先查符合条件的支持。'],[C('公办本科，生活费仍有缺口','college_start',mark('university')),C('民办本科，学费缺口更大','tuition',mark('private'))],13);
  N('tuition',2022,'暑假筹学费',['两个月。你把学费、住宿和生活费分开。','先问资助、入学手续，再看还需要多少。'],[C('申请支持，课余再挣钱','college_start',{flags:{aid_info:true}}),C('看实际兼职','campus_work'),C('先核助学借款与付款方式','college_start',s=>money(s,0,8000,'助学款直接用于学费，非现金收入'))],40);
  N('college_start',2022,'大学在读',s=>[H(s,'college')?'中专单招和普高录取，在这里仍有不同来历。':'学费与生活费都有自己的账。','课表和兼职排班，不能在同一个时段。'],[C('校内岗位或普通兼职','campus_work'),C('继续学习，准备实习','internship',{learn:1,study:1}),C('记生活，慢慢发内容','creator_seed',{learn:1}),C('专科准备专升本','upgrade',{},s=>H(s,'college'))],40);
  N('upgrade',2025,'专科毕业',['资格、准备、考试和费用，你逐项问清。','不是拿过奖就直接录取。'],[C('实际考入本科，继续读','internship',mark('university')),C('先去工作','job_entry')],13);
  N('creator_seed',2024,'大学在读',['花了三个小时。十三个赞。','第二天，你还是去上课。'],[C('继续写，自己查问题','internship',{learn:2,flags:{creator:true}}),C('留着账号，先找收入','campus_work',{learn:1,flags:{creator:true}})],1);
  N('internship',2025,'实习选择',['相关岗位补贴不高，异地还要住处。','现有兼职更快有钱。你把两种开销算了一遍。'],[C('先做能描述的相关工作','graduate',{learn:1,flags:{work_experience:true}}),C('争取本地机会，边工作边学','graduate',{learn:1}),C('先挣眼下的钱','job_entry')],8);
  N('graduate',2026,'毕业找工作',['毕业证没有把生活借款清掉。','接下来，工资什么时候到账也很重要。'],[C('普通行政岗位','admin_start',mark('admin')),C('实际运营岗位','hangzhou'),C('看培训招聘','training'),C('自学创作的条件已经有了','creator_prepare',{},s=>H(s,'creator')&&s.learn>=2)],8);

  N('campus_work',2022,'找兼职',['校内勤工、校外排班、生意和高薪邀约不是一件事。','你想先核哪一条？'],[C('奶茶／食堂','tea_start'),C('模特／礼仪邀约','model_or_event'),C('游戏陪玩／台球厅','play_start'),C('校园小生意／二手物品','small_start')],40);
  N('model_or_event',2022,'兼职招聘',['免费试镜和活动礼仪，写在不同消息里。','哪份工作、谁付款，得分别问。'],[C('去试镜','model'),C('核清礼仪工作的条件','party_start'),C('回普通兼职','tea_start')],15);
  N('tea_start',2022,'餐饮兼职',['排班、工资、结算时间。','食堂员工还告诉你学校有勤工信息。'],[C('做完这一段','tea_month'),C('先问学校岗位，保住上课','internship',{learn:1,flags:{aid_info:true}})],23);
  N('tea_month',2023,'奶茶店员',['工资真的发了。吃住也要付。','你开始教新来的怎么交接。'],[C('想继续做这份职业','tea_manager'),C('大学生活还要继续','internship',{},college),C('看实际求职方向','job_entry')],23,{enter:s=>period(s,2,3200,2500,'餐饮工作')});
  N('tea_manager',2025,'奶茶职业',['带新人、补货、处理缺班。','你承担过这些，才接到店长岗位。'],[C('接下实际职责','end_tea',s=>period(s,6,5000,3600,'店长阶段')),C('不接管理，仍做自己的生活','ordinary_life')],23);
  N('model',2022,'模特试镜',['“条件很好。”','接着是模卡，1980。合同没有写何时安排工作。'],[C('付费拍照','model_wait',pay(1980,'模卡费用'),afford(1980)),C('核承诺，不先付款','tea_start'),C('缺钱，不拍了','tea_start')],15);
  N('model_wait',2022,'等模特工作',['照片很好看。','等了几周。询问过，工作仍没来。'],[C('这段就停在这里','end_model'),C('继续找别的活动','party_start'),C('回普通工作','job_entry')],15);
  N('party_start',2022,'活动礼仪',['活动地点、联系人和结束时间核过了。','衣服与车费谁出，也先问了。'],[C('接这一次签到引位工作','party_first'),C('不接，找普通工作','job_entry')],46);
  N('party_first',2022,'活动兼职',['工作做完，款到账。','介绍人又发来一场：“这次坐一会儿。”报价更高。'],[C('问清范围，明确接受这次','party_shift'),C('不接新内容，只接原类','party_keep'),C('就停在这里','party_leave')],46,{enter:gain(420,'活动报酬减实际通勤成本')});
  N('party_shift',2023,'商务活动',['原先说到散场。现场又想延长。','延时、报价和做什么，你再次问清。'],[C('只按原来的约定','party_keep'),C('接受明确的新范围','party_more'),C('不再接新场','party_leave')],46,{enter:gain(880,'本次已完成工作净到账')});
  N('party_keep',2023,'活动兼职',['你只接范围说清的那类。','次数少一些。钱仍是实际赚来的。'],[C('留下这份工作','end_guestlist'),C('带着结算退出','party_leave')],46,{enter:gain(1400,'明确范围活动的阶段净收入')});
  N('party_more',2023,'活动兼职',['更多场次，更多钱。周末很少空着。','下一个邀约的文字，又短了一点。'],[C('只做我已接受的范围','end_guestlist'),C('到这里，全部停','party_leave')],46,{enter:gain(2600,'扩大工作量后的净到账')});
  N('party_leave',2023,'停止活动兼职',['做过的场次，你列成两栏：收到了，没收到。','下一条邀约，你没回。'],[C('停在散场以后','end_afterparty'),C('重新找看起来正规的模特','model'),C('另找工作','job_entry')],47);
  N('play_start',2022,'陪玩订单',['真正打游戏开始。计时、结算和服务范围先说清。','不是下载软件就有订单。'],[C('用已有游戏能力接单','play_orders'),C('朋友介绍台球厅岗位','billiards'),C('换普通兼职','tea_start')],39);
  N('play_orders',2023,'游戏陪玩',['有顾客复购。几单确实到账。','有人问能不能换成陪聊，或者线下见面。'],[C('一直只接游戏订单','end_play'),C('停止接单','job_entry'),C('不接私人邀约，看台球厅工作','billiards')],39,{enter:gain(600,'游戏订单净到账')});
  N('billiards',2023,'台球厅助教',['排班、接待、顾客相处。你做了一段时间。','球杆、运动裤、香水小样。都是你自己买的。'],[C('继续这份生活','end_billiards'),C('这阵子结束，换工作','job_entry')],16,{enter:s=>period(s,3,4000,3100,'台球厅工作')});
  N('small_start',2022,'校园小生意',['有人真需要用品、零食或美甲服务。','也可以只卖自己的闲置。'],[C('小批交付，不囤大货','small_done'),C('卖自己的东西','resell'),C('有人介绍便宜鞋货源','shoes'),C('先找餐饮兼职','tea_start')],40);
  N('small_done',2023,'校园经营',['东西交到人手里。退款和成本扣过。','下一笔生活费用，你确实能自己付。'],[C('就这样慢慢积累','end_small'),C('毕业后继续自己的电商','ecom_start'),C('带着经验继续学业','internship',{},college)],40,{enter:gain(1200,'校园小生意净收入')});
  N('resell',2023,'二手交易',['卖自己的东西，是把物品换成现金。','不是所有成交额都算新赚的钱。'],[C('到这里停，保留现金','end_small'),C('核来源、退款与成本，再小批交易','small_done'),C('问鞋货源','shoes')],40,{enter:gain(300,'闲置变现，非经营利润')});
  N('shoes',2023,'鞋货源',['合法渠道与仿冒不能混叫。','上家给出便宜报价。你先问证明、库存和退货。'],[C('核清合法来源，只小批交付','small_done'),C('不核来源就加大拿货','shoe_loss',pay(500,'来源不明货物投入'),afford(500)),C('不碰这笔生意','job_entry')],41);
  N('shoe_loss',2023,'处理存货',['有人投诉。上家联系不上。','库存不是房租钱。该承担的成本还在那里。'],[C('停止拿货，处理实际退款','job_entry',mark('scammed'))],41);

  N('job_entry',2021,'找工作',['当前的学历、现金和住处，决定能去哪。','不是每份工作都给车票和住宿。'],[C('县城服务业／前台','service_entry'),C('工厂岗位','factory_entry'),C('有杭州岗位线索，先算费用','hangzhou'),C('普通工作，慢慢生活','ordinary_life')],8);
  N('service_entry',2021,'服务业求职',['问过年龄、排班和工资。','有的地方不合条件，不能直接开工。'],[C('有实际前台岗位','front_start'),C('有餐饮岗位','tea_start'),C('先做普通服务业','ordinary_life')],9);
  N('front_start',2021,'前台',['号码牌、钥匙、收银和交接本。','上一班让你先把账核清。'],[C('接下这份前台工作','front_paid'),C('不接，找别的岗位','ordinary_life')],9);
  N('front_paid',2021,'前台',['一笔工资到账。房租和生活费也划掉了。','新人来问柜子在哪，你已经知道。'],[C('一直做普通前台','end_reception'),C('另有晚间接待邀请','front_offer'),C('攒下一点，换住处与工作','ordinary_life')],9,{enter:s=>period(s,2,3200,2600,'普通前台')});
  N('front_offer',2022,'前台',['钱按场算，比一班多。','消息没写全做什么、几点散、谁结账。'],[C('问清迎客核名单的范围，接一次','front_once'),C('不接，保留原岗位','end_reception')],11);
  N('front_once',2022,'前台／额外工作',['迎客、核名单、等散场。','款真的到了。打车费也是真的。'],[C('再接明确范围的工作','front_change'),C('不再接','front_leave')],11,{enter:gain(480,'额外接待净到账')});
  N('front_change',2023,'额外接待',['散场以后，又有人叫你留下。','加多少、留多久，原报价没算。'],[C('只做已说清的范围','front_continue'),C('把新增内容问清，接受才做','front_continue'),C('全部停止','front_leave')],11);
  N('front_continue',2023,'接待工作',['几次做完，你留下了一些钱。','排班换过几次。电话常在快睡着时响。'],[C('按范围继续这份生活','end_beyond'),C('停止额外工作','front_leave')],11,{enter:gain(1900,'接待阶段净收入（不与原班重复计算）')});
  N('front_leave',2023,'停止接待',['已做的款核了一遍。下一场不再接。','原岗位在不在，需要另问。'],[C('这段就停在这里','end_lastnight'),C('另找具体工作','ordinary_life')],10);
  N('factory_entry',2021,'电子厂',s=>[H(s,'student_intern')?'这是学校安排的实习。学生身份还在。':H(s,'left_school')?'你从学校出来，到了这里。':'学历与以前的工作写在招聘表上。','初中离校、普高退学、中专和专科实习，是不同来历。'],[C('先学交接和工位','factory_life'),C('暂不进厂，做普通工作','ordinary_life')],22);
  N('factory_life',2022,'电子厂工人',['工资、工时和生活费有各自的账。','厂里不只有一种人生。'],[C('继续普通工作','factory_regular'),C('跟主管逐渐相处','supervisor'),C('下班后写与拍','writing'),C('实习时遇到真实工伤','injury',{},s=>H(s,'student_intern'))],22,{enter:s=>period(s,3,3800,3000,'工厂阶段')});
  N('factory_regular',2028,'电子厂工人',['你熟悉工位，也教过新人。','没结婚，没暴富。工资仍然有。'],[C('停在这份生活','end_factory'),C('保留工作，看看家庭来信','family_gate')],22,{enter:s=>period(s,24,4200,3600,'长期工厂生活')});
  N('injury',2022,'治疗与生活调整',['事故发生后，有人陪你处理治疗和手续。','赔付真正到账前，不能当成可以花的钱。'],[C('经历处理和赔付，回爷爷奶奶家','injury_settle'),C('继续安排岗位与生活','ordinary_life')],22);
  N('injury_settle',2023,'回乡',['身体留下变化。手续和等待也有过程。','这笔补偿是真实到账后的剧情款，不是受伤奖励。'],[C('去学种菜和赶集','farm_start'),C('把钱留下，找合适工作','ordinary_life')],21,{enter:gain(18000,'虚构个案赔付净到账，非赔偿标准')});
  N('writing',2023,'电子厂／记录生活',['下班以后，写一点、拍一点。','几个月，几乎没人看。你还是留下记录。'],[C('继续写，不要求被看见','end_writing'),C('投稿并真正有人联系','writing_seen'),C('继续普通厂里生活','factory_regular')],18);
  N('writing_seen',2024,'工厂写作',['编辑联系你。厂里也看到内容。','一边问稿件，一边问你愿不愿做宣传。'],[C('保留内容，承担真实岗位冲突','writing_conflict'),C('核报酬，接受宣传位置','writing_sign'),C('不接名头，自己写','end_writing')],19);
  N('writing_conflict',2024,'离开岗位',['你没有照要求改去那一段。','作品发表。随后真的发生岗位冲突。'],[C('停在署名这里','end_byline'),C('带着作品重新找工作','ordinary_life')],19);
  N('writing_sign',2024,'工厂宣传岗位',['你怀疑“工人诗人”的名头，也看了报酬。','厂门口的诗印好了。'],[C('接下这份实际位置','end_sign'),C('不再接宣传，回自己的记录','end_writing')],20,{enter:gain(1500,'宣传工作实际净报酬')});
  N('supervisor',2023,'电子厂',['他留过几次饭。也告诉你调班流程。','“休息日，要不要见一面？”'],[C('只做同事','factory_regular'),C('下班真正相处几次','supervisor_date')],43);
  N('supervisor_date',2023,'电子厂／恋爱',['你们在厂外见过几次。','另一位女工说，他也约过她。你先看日期。'],[C('问清，确认关系后已停止','supervisor_life'),C('消息确实在承诺以后，谈清再决定','supervisor_problem'),C('分开，保留自己的工作','supervisor_separate')],43);
  N('supervisor_problem',2024,'电子厂／关系冲突',['他承认没有停止联系。','你的工资和工牌，仍是你自己的。'],[C('分开','supervisor_separate'),C('仍继续，先保留自己的工作和住处','supervisor_unresolved'),C('有真实改变，之后重新相处','supervisor_life')],45);
  N('supervisor_life',2025,'电子厂／共同生活',['住处、工作和钱，你们谈过。','不是领证就多了一套房。'],[C('保持有真实照料的关系','end_badges'),C('商量结婚，后来再遇到冲突','supervisor_married'),C('我仍想分开','supervisor_separate')],43);
  N('supervisor_married',2027,'已婚／电子厂',['手续和共同住处确实办过。','后来，一份新记录让你再次核对关系。'],[C('事实澄清，关系仍能继续','end_badges'),C('隐瞒未解决，我暂时留下','supervisor_unresolved'),C('决定离婚，安排手续与住处','supervisor_divorce')],45);
  N('supervisor_unresolved',2027,'关系未解决',['你还在工作，也还在核自己的开销。','问题没有自动消失。'],[C('当下继续一起生活','end_bed'),C('结束关系，安排自己的下一段','supervisor_separate')],45);
  N('supervisor_separate',2027,'自己的生活',['分手没有把工资退回去。','工作柜和房门，你重新安排了一遍。'],[C('停在自己的工牌这里','end_lock'),C('继续工作生活','ordinary_life')],44);
  N('supervisor_divorce',2028,'重新安排生活',['手续、住处和钱分别处理过。','第一晚，门口没有他的鞋。'],[C('停在这段变化','end_lock'),C('带着经历重新工作','ordinary_life')],44);

  N('hangzhou',2023,'杭州求职',['岗位线索、路费和住处，先一项项核。','客服、中控、场控、助播，不是一个岗位。'],[C('有实际岗位，付启动费用','hangzhou_work',pay(400,'往返与入职初期费用'),afford(400)),C('用仍在的藏款付路费','hangzhou_work',s=>{s.flags.stash=false;money(s,500,0,'取回旧棉袄现金');money(s,-400,0,'杭州启动交通费用');},s=>H(s,'stash')),C('先在本地生活','ordinary_life')],5);
  N('hangzhou_work',2025,'电商岗位',['上架信息、现场核对、交接和复盘。','你做过的任务，终于能讲清楚了。工资真的提高。'],[C('停在这段职业生活','end_binjiang'),C('用经验尝试自己的生意','ecom_start'),C('记生活，继续表达','creator_prepare',{learn:1,flags:{creator:true}},college)],5,{enter:s=>period(s,12,7200,5900,'杭州岗位工作')});
  N('admin_start',2026,'行政',['工资4200。房租、吃饭和通勤要从里面出。','工作不是学校续章。你开始自己记账。'],[C('保持普通工作','admin_later'),C('有家庭往来，看看来信','family_gate'),C('已有创作积累，试自己的项目','creator_prepare',{},s=>H(s,'creator'))],8,{enter:s=>period(s,6,4200,3700,'行政起步')});
  N('admin_later',2033,'行政',['后来工资6200。也多了几个工作群。','这些年的房租和生活支出，都算过。'],[C('停在普通人生','end_normal'),C('我有自己的关系与家庭','relationship_start')],8,{enter:s=>period(s,60,6200,5800,'行政后期生活')});
  N('ordinary_life',2026,'普通工作',['问过招聘，实际做了一段。','收入没有传奇。也不是所有日子都发生灾难。'],[C('普通生活继续','admin_later'),C('我想尝试考试','exam_job'),C('家庭还与我联系','family_gate'),C('刷到“大女主”的话术','poor_context')],8,{enter:s=>period(s,6,3800,3350,'普通工作阶段')});
  N('poor_context',2027,'上班／自己租住',['工作、租房，和未做完的生活安排。','视频说，永远先爱自己。'],[C('六点半仍要起床','end_poor'),C('先把自己的账弄清','admin_later')],4);
  N('farm_start',2024,'回爷爷奶奶家',['跟着学种菜、浇水。住处是真正有的。','后来，你把一车菜拉去赶集。'],[C('卖完这一车','end_market',gain(260,'首车菜实际净所得')),C('继续务农，拍自己的生活','farm_content')],21);
  N('farm_content',2025,'务农／内容记录',['第一条23个赞，第二条9个。','你一直拍。后来一条被很多人看见。'],[C('仍把种菜卖菜做好','end_market'),C('核货源和履约，试农产品生意','ecom_start')],21);

  N('wind_entry',2024,'互联网机会',['你实际接触到这些机会，才开始核条件。','流量、报价与收益，不是保证。'],[C('比特币的盈利消息','coin_first'),C('实际开直播','stream_start'),C('做电商','ecom_start'),C('微博生活收到了特别私信','foot_offer')],26);
  N('coin_first',2024,'小额投资情境',['第一次、第二次，页面都显示盈利。','接着选什么，风险不同。'],[C('把盈利兑现','coin_cashout'),C('承担实际杠杆风险，不借款','coin_risk',pay(200,'虚构杠杆情境投入'),afford(200)),C('另外借钱承担杠杆风险','coin_borrow'),C('不再投入，回生活','ordinary_life')],26);
  N('coin_cashout',2024,'提现',['订单结算。款真正回到银行卡。','屏幕上的数字，这次能付生活费了。'],[C('现在停','end_withdraw'),C('带着经验回普通生活','ordinary_life')],26,{enter:gain(260,'投资净收益兑现（情境设定）')});
  N('coin_borrow',2024,'借款与杠杆',['借款和仓位分开。','借入的钱投进去，不在你的自由现金里。'],[C('承担这笔实际风险','coin_risk',s=>money(s,0,1500,'借款直接投入风险仓位')),C('不借，收手','coin_cashout')],27);
  N('coin_risk',2024,'杠杆情境',['风险阈值触发。仓位被强制平仓。','普通现货下跌，不是这件事。'],[C('停在这个结果','end_liquidated'),C('面对剩下的账重新工作','ordinary_life')],27);
  N('foot_offer',2024,'成年／生活账号',['你写过自己的生活。有人私信报价200。','内容范围、自己是否愿意，你想了一阵。'],[C('删掉私信，继续日常','ordinary_life',mark('deleted_dm')),C('只接受自己确认的非露骨范围','foot_paid'),C('回到其他实际机会','wind_again')],17);
  N('foot_paid',2025,'成年／账号收入',['几次收入是真的。更多要求也来了。','还有账号、熟人和外泄的风险。'],[C('拒绝新增要求，保留已接受的范围','end_cyber'),C('带着已到账的钱停止','ordinary_life'),C('只把账号做成普通内容','stream_start')],17,{enter:gain(1000,'明确接受范围的账号净报酬')});
  N('wind_again',2025,'重新选择',['上一份机会不接。','这不是拿到所有新职业的门票。'],[C('有设备，试直播','stream_start'),C('有产品与顾客线索，试电商','ecom_start'),C('有实际岗位，先工作','ordinary_life')],29);
  N('stream_start',2024,'直播起步',['有设备。真正开过几次。','几十个人。有人送礼物，实得到账。'],[C('继续复盘开播','stream_work'),C('止于这段尝试','stream_leave'),C('查看上镜的分期邀约','beauty')],29,{enter:gain(280,'开播阶段实得减成本')});
  N('stream_work',2026,'主播',['节目、互动、排班和复盘。','礼物流水扣完分成与成本，才是能留下的钱。'],[C('保持这份职业','end_stream'),C('帮助新人，做培训','train_start'),C('与观众在镜头外相处','stream_date'),C('有储蓄，考虑多年后的退出','stream_savings')],29,{enter:s=>period(s,12,8500,6900,'直播工作（虚构参数）')});
  N('stream_leave',2026,'停止直播',['灯关了。钱和未结束的约定各自核清。','停止不是必须先亏光。'],[C('停在最后一场','end_laststream'),C('用能讲清的经验找运营岗位','hangzhou')],31);
  N('stream_date',2027,'镜头之外的关系',['你们在线下相处过，也见过不直播的日子。','帮助是真的。结婚仍是另一项决定。'],[C('双方愿意，共同生活','end_streamwife'),C('继续自己的工作','end_stream'),C('离开关系和镜头','stream_leave')],30);
  N('stream_savings',2031,'直播与储蓄',['多年收入真的到账，也付过成本和生活费。','这条稀有情境留下的钱很多，不是普通主播行情。'],[C('不婚，退出互联网','end_single'),C('已有经验，转幕后培训','train_start'),C('现在停止开播','stream_leave')],32,{enter:s=>period(s,36,58000,24000,'稀有高收入直播情境')});
  N('train_start',2031,'带新人',['你曾帮一个新人准备开播，又一起复盘。','现在，有人确实请你继续带。'],[C('受雇做机构内部培训','train_employee'),C('已有真实生源，先小班试教','train_class'),C('不转型，停止开播','stream_leave')],34);
  N('train_employee',2032,'主播培训人员',['教准备、互动和复盘。','电商主播的商品与售后，是另一种工作。'],[C('保持这份幕后职业','end_trainer'),C('实际工作太满，结束岗位','ordinary_life')],34,{enter:s=>period(s,6,6000,4200,'受雇培训')});
  N('train_class',2032,'小班培训',['几位真实学员。你先完成答应的课。','预收款不能全部拿来当利润。'],[C('交付后，小规模继续','train_done'),C('扩大招生，承担额外成本','train_expand'),C('交完已有课程，不收新生','train_done')],34);
  N('train_done',2032,'完成培训交付',['费用、退款与时间都核过。','灯仍亮着，坐在镜头前的人换了。'],[C('停在这段职业变化','end_trainer'),C('不接新班，去其他实际岗位','ordinary_life')],34,{enter:gain(2100,'培训交付后净收入')});
  N('train_expand',2032,'培训成本',['招生成本上升。交付和退款仍要做完。','这次扩大没有带来预期利润。'],[C('不接新班，处理实际责任','ordinary_life'),C('把已有班交付完','train_done')],34,{enter:s=>money(s,0,3000,'培训扩张真实未付成本形成欠款')});

  N('ecom_start',2025,'小批经营',['有产品与顾客。先试小批，不是大库存。','物流、退货、到账和下一批货一起看。'],[C('小批做完，核净收益','ecom_small'),C('融资扩大拿货与投流','ecom_expand'),C('不做自己的店，找岗位','hangzhou')],41);
  N('ecom_small',2026,'小批卖货',['这批交付完成。收款扣完成本还留了钱。','今天，可以选择不补货。'],[C('止于这批，钱留下','end_lastbox'),C('再扩大生意','ecom_expand'),C('留住现金，回普通生活','ordinary_life')],41,{enter:gain(1800,'小批电商净收益')});
  N('ecom_expand',2026,'电商融资',['营业额越来越高。退货、投流和库存也一起长。','你为这批货承担了实际借款。'],[C('继续结算这笔生意','ecom_report'),C('先缩减，处理已有货和借款','ecom_stop')],28,{enter:s=>money(s,0,40000,'电商融资直接支付经营投入')});
  N('ecom_report',2027,'电商账本',['特定情境：营业额86万，利润负14万。','生意账与个人借款不是同一个数。库存还在，房租却要现金。'],[C('停在账本这个结果','end_ecomdebt'),C('缩减生意，不再扩大借款','ecom_stop')],28);
  N('ecom_stop',2027,'停止扩张',['卖掉一部分实际存货。款真正到账。','剩余借款还要面对，不能一键清零。'],[C('把这段停下来','end_ecomdebt'),C('带着账回去工作','ordinary_life')],28,{enter:gain(3500,'存货处理实际净回款')});
  N('training',2026,'求职面试',s=>['零经验新媒体运营。面试后先让你交19800培训。',H(s,'scammed')?'先交钱，后面才有岗位。话术听着有点熟。':'合同上，课程与就业承诺要分开核。'],[C('签分期，课程和工作分别看','training_done',s=>money(s,0,19800,'培训款直接付机构')),C('带走合同核验，不先签','ordinary_life',{learn:1}),C('走，继续其他实际招聘','ordinary_life')],8);
  N('training_done',2027,'上课以后',['学到了一些。工作并没自动落在手里。','还款日是真的。'],[C('实际找到普通岗位，先工作','ordinary_life'),C('用已有内容经验找相应岗位','hangzhou')],8);
  N('beauty',2025,'上镜咨询',['有人说，调整之后更适合镜头。','效果、费用、风险和分期，是不同问题。'],[C('咨询核清后选择做，费用直接付机构','beauty_later',s=>money(s,0,8000,'上镜相关虚构分期费用')),C('不做，仍继续开播','stream_work')],29);
  N('beauty_later',2026,'直播／分期',['效果比你担心的好。','欠款并没有因此少一点。'],[C('继续实际开播工作','stream_work'),C('停止开播，另找岗位','ordinary_life')],29);

  N('exam_job',2027,'工作与备考',['报名资格和岗位先核。','边工作考、全职准备，要付不同成本。'],[C('边工作准备，实际考试','exam_result'),C('家里能供吃住，全职准备','exam_years'),C('不考，保住现有工作','admin_later')],25);
  N('exam_result',2028,'考试以后',['笔试、面试和录用材料，真的走过。','合格结果与未过是不同情境。'],[C('实际合格，办完录用去报到','end_exam'),C('这次未过，继续工作','admin_later'),C('未过，再准备几年','exam_years')],42);
  N('exam_years',2031,'全职备考',['几次报名、考试。','吃住由家里支持，家务也越来越多。履历空了几年。'],[C('停在这几年','end_daughter'),C('停止备考，重新找工作','ordinary_life'),C('再次真实合格，办录用','end_exam')],25);

  N('family_gate',2027,'工作／家里来信',['不是每个需求都同时到来。','你看清这次是什么事，再决定份额。'],[C('弟弟补课或电脑','brother_computer'),C('买房或彩礼的实际缺口','brother_money'),C('姐姐／弟弟需要照护孩子','childcare'),C('父母身体变化，分担养老','parents')],33);
  N('brother_computer',2027,'家里来信',['弟弟确实需要电脑。不是一句话就扣款。','他也可能真正记得你的帮助。'],[C('承担1000，其余一起想办法','family_after',both(pay(1000,'弟弟电脑实际分担'),mark('brother_pc')),afford(1000)),C('暂不承担，先保自己的生活','family_after',mark('boundary'))],40);
  N('family_after',2028,'自己的生活',s=>[H(s,'brother_pc')?'弟弟发来感谢。以后能否帮回来，是另一次实际行动。':'你没有给这笔钱，也还可以保持联系。','今天的工作仍要去。'],[C('回自己的工作','admin_later'),C('有相处中的人，看看共同生活','relationship_start'),C('自己租房，仍每天上班','poor_context')],8);
  N('brother_money',2029,'家庭分担',['买房和结婚，需要一笔实际差额。','这次彩礼缺口6万，不等于必须全由你出。'],[C('拿出一笔，剩余分担','wedding',pay(1000,'家庭婚礼实际分担'),afford(1000)),C('用现有钱与新借款承担缺口','wedding',s=>{const use=Math.min(s.cash,60000);money(s,-use,60000-use,'承担婚礼缺口，借款直接付婚礼');}),C('不出钱，仍去婚礼','wedding',mark('dowry_no'))],33);
  N('wedding',2029,'弟弟婚礼',['婚礼真的办了。','喜糖在袋子里。银行里的数字，是另一个数。'],[C('这段就停在婚礼','end_wedding'),C('回自己的生活，不自动带孩子','family_after')],33);
  N('childcare',2030,'家里照护请求',['本来说帮几个月。弟媳要工作，母亲腰不好。','你自己的岗位和回程时间，也得安排。'],[C('先临时照顾，但后来一直延长','care_extended',mark('caregiver')),C('协商轮换，保留工作','parents',mark('shared_care')),C('不能停下自己的工作','family_after')],2);
  N('care_extended',2033,'长期照护',['半年又半年。原岗位已经失去。','孩子上幼儿园了。'],[C('停在这段中断','end_halfyear'),C('让大家接手，重新找工作','ordinary_life',mark('caregiver',false))],2);
  N('parents',2032,'父母养老',['父亲住院。母亲也干不动了。','四个孩子重新算钱和时间。'],[C('协商四人按能力分担','family_after',mark('shared_care')),C('实际出一笔，保住岗位','family_after',pay(500,'养老分担'),afford(500)),C('承担照护后重新安排工作','poor_context',mark('caregiver'))],2);
  N('relationship_start',2030,'相处与生活',['认识过一段时间。钱、住处、工作都谈过。','普通销售会做饭。日子也可以还行。'],[C('双方愿意，办手续共同生活','dinner',mark('married')),C('不结婚，回自己的生活','admin_later'),C('有真实跨阶层关系的来历','wealth_date',{},college)],6);
  N('dinner',2031,'普通共同生活',['工资、家务、房贷或房租，各有承担。','今天他做饭。冰箱上贴着排班。'],[C('放下手机吃饭','end_home'),C('发张做饭照片','comments'),C('决定生孩子，并实际共同照护','family_child')],6);
  N('family_child',2033,'共同生活',['这是你们自己的决定。后来也真的一起照料。','今天他做饭，明天你早下班。'],[C('停在普通人的家','end_home')],6);
  N('comments',2031,'照片与评论',['下班回家有人烧饭。','有人祝福，有人骂娇妻。手机一直亮。'],[C('删掉','end_wife'),C('回骂','end_wife'),C('不管','end_wife')],7);
  N('wealth_date',2031,'跨阶层相处',['有实际相识和相处，不是学校随机发了一个富人。','他提出帮助。接受多少，仍由你决定。'],[C('接受具体帮助，但保留工作','wealth_life'),C('不接帮助，关系慢慢相处','wealth_life'),C('不再相处，回自己的生活','admin_later')],35);
  N('wealth_life',2032,'关系与自己的职业',['他的帮助确实有用。你的工作也仍然在。','车开到你上班的地方。'],[C('停在这份关系','end_passenger'),C('继续自己的普通生活','admin_later')],35);

  N('later_direction',2028,'新的方向',['现有技能、现金和身份不同，可行道路也不同。'],[C('核网约车条件','car_check'),C('核出国的真实材料与路径','abroad_check'),C('备考实际岗位','exam_job'),C('继续普通工作','ordinary_life')],24);
  N('car_check',2033,'驾驶工作选择',['驾照、地方准入、费用、合同先核。','自购贷款与平台配车，不用同一本收费表。'],[C('条件成立，自购车贷款','car_owned'),C('条件成立，按合同租车','car_rented'),C('算完暂不做','admin_later')],24);
  N('car_owned',2033,'网约车情境',['首付有来源，贷款实际用于车。','流水扣平台、充电、保险保养、车贷和生活，才知道剩多少。'],[C('工作与成本相容，普通继续','end_normal'),C('连续入不敷出，仍承担还款','car_nineteen'),C('核卖车估值与余贷，退出','car_sell')],24,{enter:s=>money(s,0,35000,'自购车虚构贷款余额，非统一报价')});
  N('car_nineteen',2035,'网约车／还款',['十九期。几次收入没盖住实际费用。','有的日子没出车，贷款也仍要还。'],[C('停在这一期','end_car'),C('不再撑新借款，核退出','car_sell')],24);
  N('car_sell',2035,'退出驾驶工作',['真实车款与余贷分别相抵。','不是卖车就清掉所有债。'],[C('转普通岗位，承接余账','ordinary_life')],24,{enter:s=>{const paid=Math.min(s.debt,12000);money(s,0,-paid,'卖车净款直接偿还一部分余贷');}});
  N('car_rented',2033,'租车驾驶情境',['押金、租金、退车条件，按这份合同核。','你没有同时背上购车贷款。'],[C('成本可覆盖生活，继续普通工作','end_normal'),C('按明确条件退车，再找岗位','ordinary_life')],24);
  N('abroad_check',2028,'出国信息',['目的地与路径不同，材料也不同。','语言、资格、资金和合法工作去向，逐项核。'],[C('正规材料准备与申请','abroad_apply'),C('先攒钱，不签包办承诺','ordinary_life'),C('只准备学习，不把签证当万能工作许可','internship')],36);
  N('abroad_apply',2029,'申请以后',['材料先准备，费用要按具体目的地另核。','下面是两种申请结果的虚构情境，不是获签保证。'],[C('材料未成，停在这次申请','end_returned'),C('实际合法工作路径成立，抵达后生活','abroad_arrive')],36);
  N('abroad_arrive',2030,'海外工作情境',['住处、语言和第一段工作都有过程。','没有暴富。早班快开始了。'],[C('停在普通早班','end_abroad')],37);

  N('creator_prepare',2026,'工作／自学',s=>[H(s,'creator')?'账号还在更新。又一次只有十三个赞。':'你还没有长期表达积累。愿望本身不算作品。',H(s,'computer')?'电脑在桌上。':'能用的电脑、可支配时间和生活费，还需要准备。'],[C('用已有电脑，先核生活条件','ai_first',{},creative),C('已有表达积累，买900元旧电脑','ai_first',both(pay(900,'开发用旧电脑'),mark('computer')),s=>s.year<=2026&&college(s)&&H(s,'creator')&&s.learn>=2&&!H(s,'caregiver')&&s.cash>=1500),C('继续积累，先把生活维持住','ordinary_life'),C('查别的实际工作方向','later_direction')],1);
  N('ai_first',2026,'上班／做项目',['2025年以后，你看到了Vibe Coding。','描述需求、运行。网页很丑，三个按钮点不了。'],[C('先只改一个按钮','ai_debug'),C('先睡，明天还要工作','ordinary_life')],1);
  N('ai_debug',2026,'修改与测试',['按钮没绑定动作。修好后，刷新又丢了数据。','你逐步改，手机上也试了一遍。'],[C('把一个能用的小页面做完','ai_publish'),C('先保留项目，去工作','ordinary_life')],1);
  N('ai_publish',2026,'项目与表达',['本地能点，不等于别人能打开。','你核了公开部署和数据，发出能用的小工具。有人说没用，也有人说以前没这么想过。'],[C('继续做','end_unfinished'),C('白天上班，晚上继续','end_unfinished'),C('暂时停止，留住项目','ordinary_life')],1);

  // Add genuinely conditional alternatives, never a fixed hotspot tour.
  nodes.job_entry.choices[3]=C('互联网机会或新的方向','job_branch');
  N('job_branch',2024,'工作选择',['不是同一次人生必经的机会。','你先选眼下确实能投入的方向。'],[C('普通工作','ordinary_life'),C('互联网挣钱机会','wind_entry'),C('考试／驾驶／出国信息','later_direction'),C('已有大学与表达经历，做自己的项目','creator_prepare',{},s=>college(s)&&H(s,'creator'))],8);
  nodes.college_start.choices[0]=C('核大学兼职与校园挣钱','campus_choices');
  N('campus_choices',2023,'大学／兼职信息',['排班、费用和时间。不同信息指向不同工作。'],[C('普通兼职与小生意','campus_work'),C('直播／消费与账号收入信息','campus_online'),C('继续学业与实习','internship'),C('核已有内容与自学条件','creator_prepare',{},s=>H(s,'creator'))],40);
  N('campus_online',2024,'大学／网络信息',['不是看了视频就能转型。','你先核自己真正能做的部分。'],[C('已有游戏能力，接游戏订单','play_start'),C('真实写生活后收到私信','foot_offer'),C('有设备，试直播','stream_start'),C('关掉手机，继续学业','internship')],17);
  nodes.front_paid.choices[2]=C('有住处后，按实际信息找别的工作','job_branch');
  nodes.factory_life.choices[0]=C('普通厂里生活／另外的信息','factory_options');
  N('factory_options',2024,'工厂生活',['原工位还在。下班后也会接触新的信息。'],[C('一直留在厂里','factory_regular'),C('有人讲投资收益','coin_first'),C('问自己能否换实际岗位','job_branch'),C('记录厂里的日常','writing')],22);
  nodes.ordinary_life.choices[2]=C('现有家庭往来／消费与下一步','ordinary_options');
  N('ordinary_options',2027,'自己的生活',['生活不只是坏事。你也想买东西、表达、离开。'],[C('按真实关系处理家庭请求','family_gate'),C('核考试／驾驶／出国','later_direction'),C('看消费和生育广告','consumption'),C('有教育和表达积累，自学做东西','creator_prepare',{},s=>college(s)&&H(s,'creator'))],40);
  N('consumption',2028,'日常消费',['淘宝、小红书同款，手机分期。','有些只是快乐，有些是下一期支付义务。'],[C('在现金范围内买一件','ordinary_next',pay(100,'日常消费'),afford(100)),C('留在购物车','ordinary_next'),C('看见冻卵广告，先查资格和信息','freeze_ad')],40);
  N('freeze_ad',2028,'信息与咨询',['广告说保存未来的选择。','年龄、地区、医疗资格与费用都要另核。看见广告不等于做了手术。'],[C('只收好信息，不做未知承诺','ordinary_next'),C('划走','ordinary_next')],36);
  N('ordinary_next',2028,'普通生活',['这一件事过去，工作与住处仍在。'],[C('停在普通生活','admin_later'),C('有真实相处中的人','relationship_start')],8);

  function restore(x){
    if(!x||typeof x!=='object')return x;
    x.flags=x.flags||{};x.ledger=Array.isArray(x.ledger)?x.ledger:[];x.checkpoints=Array.isArray(x.checkpoints)?x.checkpoints:[];
    if(!nodes[x.node])x.node=H(x,'caregiver')?'care_extended':college(x)?'college_start':H(x,'service')?'front_paid':H(x,'hangzhou')?'hangzhou_work':H(x,'left_school')?'job_entry':'ordinary_life';
    x.edition=3;return x;
  }
  const artFor=id=>nodes[id]?.art??8;
  function available(s){
    const choices=nodes[s.node].choices.filter(c=>(!c.when||c.when(s))&&(!s.history.includes(c.to)||nodes[c.to].route));
    if(choices.length||nodes[s.node].ending)return choices;
    // A branch already explored is not replayed, paid twice, or used to trap the player.
    const role=s.role||'';
    const end=role.includes('前台')?'end_reception':role.includes('活动')?'end_afterparty':role.includes('主播')||role.includes('直播')?'end_laststream':role.includes('工厂')||role.includes('电子厂')?'end_factory':'end_normal';
    return [C('这段经历先停在这里',end)];
  }
  window.STORY={nodes,endings,fresh,apply,has:H,college,creative,C,N,E,money,restore,artFor,available,legacyNodeIds:Object.keys(legacy.nodes),edition:3};
})();
