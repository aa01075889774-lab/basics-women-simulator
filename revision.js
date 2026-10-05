/* Edition 4: actions are decisions; offers, accidents and results are events.
 * Amounts and world variants are authored fiction, not market quotations or odds. */
(() => {
  'use strict';
  const old=window.STORY, T=window.LIFE_TEXT, nodes={}, endings=[...old.endings];
  const has=(s,k)=>!!s.flags[k], cash=n=>s=>s.cash>=n;
  const C=(label,to,effects={},when=null)=>({label,to,effects,when});
  function money(s,c,d,label){if(!Number.isFinite(c)||!Number.isFinite(d)||s.cash+c<0||s.debt+d<0)throw Error('收支不成立');s.cash+=c;s.debt+=d;s.ledger.push({year:s.year,label,cash:c,debt:d});}
  const pay=(n,l)=>s=>money(s,-n,0,l), gain=(n,l)=>s=>money(s,n,0,l), flag=(k,v=true)=>s=>s.flags[k]=v;
  const all=(...steps)=>s=>steps.forEach(f=>f(s));
  const study=n=>s=>s.study+=n, learn=n=>s=>s.learn+=n;
  function apply(s,e){if(typeof e==='function')return e(s);for(const k of ['study','learn','family'])s[k]+=e[k]||0;Object.assign(s.flags,e.flags||{});if(e.cash||e.debt)money(s,e.cash||0,e.debt||0,'选择收支');}
  // Each external fact is fixed for a run and survives reloads and branch rewind.
  function world(s,key,mod){let h=(s.flags.world_seed||1)>>>0;for(const ch of key)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;h^=h>>>16;h=Math.imul(h,2246822507)>>>0;h^=h>>>13;return (h>>>0)%mod;}
  function N(id,year,role,body,choices=[],item=null,extra={}){
    const n=nodes[id]={id,year:typeof year==='function'?s=>Math.max(s.year,year(s)):s=>Math.max(s.year,year),role,body:typeof body==='string'?T.scenes[body].body:body,choices,art:8,...extra};
    if(item!==null)n.sprite={atlas:'items-v4',tile:item};
    return n;
  }
  function gate(id,route){N(id,2018,'',[],[],null,{route,targets:[]});}
  const college=s=>has(s,'college')||has(s,'university')||has(s,'private');
  const creative=s=>college(s)&&!has(s,'sister_stay')&&!has(s,'left_school')&&!has(s,'caregiver')&&has(s,'creator')&&has(s,'computer')&&s.learn>=2&&s.year<=2026;
  const yearPlus=n=>s=>s.year+n;
  function period(s,months,gross,cost,label){money(s,months*gross,0,`${label} · ${months}个月到账收入`);money(s,-months*cost,0,`${label} · ${months}个月生活及工作支出`);}
  const fresh=()=>({edition:4,node:'birth',year:2018,role:'初三',cash:537,debt:0,study:0,learn:0,family:0,flags:{world_seed:Math.floor(Math.random()*4294967295)+1},wishes:[],history:[],ledger:[{year:2018,label:'开局可用现金537元（虚构初始值，不是收入奖励）',cash:537,debt:0}],checkpoints:[]});
  for(let i=0;i<endings.length;i++){const id=endings[i],row=T.endings[i];N(id,id==='end_unfinished'?2026:2018,'',[row.body],[],null,{ending:true,title:row.title,art:i});}
  nodes.end_liquidated.body=s=>['你开的比特币合约触发了保证金处理条件，平台执行强制平仓，这次投入损失了。',s.flags.coin_borrowed?'你为这笔交易另外借过钱，借款仍要按约偿还。页面里的仓位没有了，还款日期却不会跟着消失。':'这次用的是自有资金，没有为这笔交易另外借款。已经亏掉的这笔钱，不能再拿来付生活费。'];
  nodes.end_wedding.body=s=>{const rows=Array.isArray(s.ledger)?s.ledger:[];return ['弟弟的婚礼办了，你回去参加，亲戚又问起你什么时候结婚。',s.edition!==4?'婚礼很热闹。回程之前，你仍要算自己的生活费和实际借过的钱。':rows.some(t=>t.label==='婚礼借款直接支付家庭缺口（虚构合同）')?'你替家里借了60000元支付婚礼和彩礼缺口。婚礼结束，这笔债仍由你按约偿还。':rows.some(t=>t.label==='婚礼及彩礼缺口个人出资')?'你按商量的份额出了3000元，没有为婚礼另外借款。先前其他借过的钱仍另算。':'你重新谈了这次出资，没有为婚礼另外借款。参加婚礼，不等于自动承担全部缺口。',`你看了一眼余额：${s.cash.toLocaleString('zh-CN')}元。${s.debt?`全部未还借款${s.debt.toLocaleString('zh-CN')}元。`:'目前没有未还借款。'}`];};
  const setJob=(job,origin)=>s=>{s.flags.job=job;if(origin)s.flags.work_origin=origin;};
  const jobRole=s=>s.flags.job||'店员';

  N('birth',2018,'初三',['你出生于2003年，山河四省某县城乡镇。家里四个孩子：两个姐姐，你，一个弟弟。','父亲酗酒、出轨，在家动手打人，也不稳定承担家里的开支。母亲靠做体力活挣钱。家里钱紧，弟弟的花费总排在你前面。','姐姐们已经走上不同的路：有人辍学打工，有人做服务业。','现在是2018年。你十五岁，初三，中考快到了。'],[C('把今天的作业拿回家','father')],null,{narration:1});
  N('father',2018,'初三','S01',[C('发给他：你睡了吗','first_love'),C('给姐姐打电话','sister'),C('把自己的房门锁上','school_event')],0);
  N('first_love',2018,'初三','S02',[C('让他把工资、住处问清，周末一起去看看','couple_offer'),C('告诉他：我想先把中考考完','love_school',flag('first_love'))],14);
  N('couple_offer',2018,'初三',['餐馆包吃，住处得两个人另租。工资写在纸上，他先算了押金。','店里听说你的年龄，让你等满十六岁。姐姐答应先让你短住，不用立刻去挣一份不合法的工资。','他问：“这几个月还去上课吧？我下班来接你。”'],[C('把明天的作业装进书包，等他下班','couple_work'),C('拿两份费用纸，先问能报的学校','school_offer')],14);
  N('couple_work',2019,'餐馆帮工',['你满了十六岁。老板核过年龄，给你写了班次与工资，做的是店里的辅助工作。','两个人开始轮班。工资真的发了，押金和房租也真交了。下班后他给你留饭。','停电那晚，他用小炉子煮面，问要不要放最后一个鸡蛋。'],[C('把碗递给他，等面煮开','end_noodles')],14,{enter:s=>{s.flags.left_school=true;setJob('餐馆帮工','couple')(s);period(s,3,2200,1800,'共同打工中你的个人收支');}});
  N('love_school',2018,'初三',['他把借来的题册递给你，下班经过校门时仍会等。','母亲发现你们来往，说读书已经花钱，不要再添别的事；后来连住宿和饭钱也不愿筹。','你拿着缴费纸去找老师。她需要先知道，谁能让你这段时间有地方住。'],[C('把姐姐电话给老师，请她们一起商量','love_support'),C('给姐姐问短住和工作，带上自己的资料','sister')],4);
  gate('love_support',s=>world(s,'family_support',3)===0?'support_failed':'support_help');
  N('support_help',2018,'初三',['姐姐答应让你先住，老师帮着联系了当前能申请的支持。不是所有费用都够了，但中考前的吃住有了安排。','他没有替你决定读不读，仍把题册带来了。'],[C('把明天要用的书收好','school_event',study(1))],4,{narration:7});
  N('support_failed',2018,'学业中断',['姐姐那边也住不下。老师打过电话，家里仍不承担接下来的生活费。','你想继续上课，住处和吃饭却已经接不上。姐姐替你问到一间能暂住的房。'],[C('先住过去，给工作联系人问年龄与到岗日','direct_work')],4,{enter:flag('left_school')});
  N('sister',2018,'初三','S26',[C('问能不能住一晚，明天回学校','school_event'),C('问能不能长期住下，自己也做家务和找工作','sister_stay',all(flag('sister_stay'),flag('left_school')))],14,{narration:4});
  N('sister_stay',2019,'住在姐姐家',['你洗工作服、做饭，姐姐下班回来才吃。去问过的几家店不是缺夜班，就是要你立刻到岗。','后来姐姐结婚，折叠床挪到鞋柜边。孩子出生，她又要回去上班。','她问你能接哪段时间，好让她去商量班次。'],[C('先接下白天照护，再约时间谈交接','sister_care',flag('caregiver')),C('把能上班的时间说给她，问前台还缺不缺人','front_entry'),C('请她问包住的餐馆，去看看实际班次','service_offer')],null,{art:3,narration:2});
  N('sister_care',2021,'照护姐姐的孩子',['半夜孩子哭，你比姐姐先醒。白天一整段时间也被喂饭、洗衣和接送占了。','原来问过的岗位已经招了人。姐姐下班，孩子仍先往你怀里伸手。'],[C('给孩子收好明天要带的东西','end_second_mother')],null,{art:3});
  gate('school_event',s=>['period_poverty','glasses','rice_card','small_uniform','phone_screen','toothache'][world(s,'school_item',6)]);
  N('period_poverty',2018,'初三','S03',[C('递过去：能不能再借我一片','period_friend'),C('等下课，去办公室找女老师','period_teacher'),C('给能联系上的姐姐发消息','period_sister')],3);
  N('period_friend',2018,'初三',['同桌看完纸条，把一片从书包里递来，没有让你在全班说。','你低声说谢谢，还在想前两天为什么没和她好好说话。'],[C('处理好后，把笔记借来补这一课','money_jar')],3);
  N('period_teacher',2018,'初三',['女老师从抽屉拿出一片，让你先去处理。回来后她继续讲题，没有问全班发生了什么。'],[C('拿好课本，回座位','money_jar')],3,{narration:7});
  N('period_sister',2018,'初三',['姐姐正在上班，看见消息后先联系了能到学校的老师。','午休时东西送到了。你拿着袋子，没立刻走出办公室。'],[C('把袋子收进书包，回去上课','money_jar')],3);
  N('glasses',2018,'初三',['眼镜腿断了，胶带绕了两圈。不是黑板模糊，是镜片总往下歪。','前排坐着几个你不熟的同学。开口换座位，还得让老师看一眼这副眼镜。'],[C('下课问老师能不能坐前排','glasses_seat'),C('放学问眼镜店修理费','glasses_repair')],1);
  N('glasses_seat',2018,'初三',['老师让你先坐到前面，眼镜仍要修。你抱着课本过去，终于能抄完黑板左边。'],[C('把抄好的题带回家','money_jar')],1);
  N('glasses_repair',2018,'初三',['店里说旧镜架能先修，收二十。新架贵得多，你又把旧眼镜递了过去。'],[C('付二十，等修好','money_jar',pay(20,'眼镜修理'),cash(20)),C('先拿回眼镜，明天问能否坐前排','glasses_seat')],1);
  N('rice_card',2018,'初三',['饭卡余额不够。后面的人等着，你说今天不太饿，把餐盘退了回去。','老师正在收明天的通知，你的那张夹在书里。'],[C('把饭卡和费用通知一起拿给老师看','money_jar')],4);
  N('small_uniform',2018,'初三',['校服袖口又短了。有人问为什么总穿这件，你说穿着舒服。','回家一路，你给自己想出了另外三个回答。'],[C('把袖口翻平，拿出明天的缴费纸','money_jar')],4,{narration:5});
  N('phone_screen',2018,'初三',['旧手机碎了一角。班群的文件要往左滑，才能看清金额。','你把数字抄到纸上，免得屏幕下次彻底不亮。'],[C('把费用纸带回家','money_jar')],5);
  N('toothache',2018,'初三',['牙疼了一晚。你把早饭的硬馒头掰小，仍不敢用那边咬。','母亲问能不能过几天再看，你拿着校医说要就诊的纸，等她把电话打完。'],[C('把疼了一晚的情况和校医的纸给她看','money_jar'),C('给姐姐发消息，请她陪着问就诊安排','money_jar')],8);
  N('money_jar',2018,'初三','S04',[C('等她挂电话，把自己的通知递过去','small_info',flag('asked_school')),C('先拿二百，问剩下的钱从哪里来','small_info',pay(200,'弟弟补课实际出资'),cash(200)),C('把五百挪到旧棉袄口袋里','small_info',flag('cash_in_coat'))],2);
  gate('small_info',s=>['agent_first','task_first','school_offer'][world(s,'first_opportunity',3)]);
  N('agent_first',2018,'初三','S05',[C('问她这399有多少件，卖不完能不能退','agent_terms'),C('问上次买过的同学，还想不想要','agent_orders'),C('按她发来的清单付399拿货','agent_stock',pay(399,'第一次代理货款'),cash(399))],6,{enter:gain(30,'两笔代发订单佣金到账')});
  N('agent_terms',2018,'初三',['她发来清单：399里是这一小批货，运费另付，卖不掉不给退。1999一档货更多，单件报价更低。','她说原来那几位同学一定还会买。你翻了聊天记录，她们只说上次收到不错，没有答应下一批。'],[C('按399清单拿这一批','agent_stock',pay(399,'小批代理货款'),cash(399)),C('问1999这批运费和发货责任，给姐姐看','agent_large_terms'),C('仍代发，只接已经确认的订单','school_offer')],6);
  N('agent_orders',2018,'初三',['两个人回复想要，一人只是问价格。你把确认的地址给她，不替没回复的人先买。','这次提成到账，你把中考日期重新圈了一遍。'],[C('收好订单记录，把今晚的题做完','school_offer')],5,{enter:gain(12,'已完成代发订单佣金')});
  N('agent_large_terms',2018,'初三',['1999那批包括更多货，还要60运费。姐姐没把广告里的收入当保证，问你订单有多少。','你手里没有2059。对方说可以先想办法筹，但没有人替你承担卖不掉的货。'],[C('发手里已确认的订单，仍请她代发','school_offer'),C('改拿399这批','agent_stock',pay(399,'代理小批货款'),cash(399))],6);
  N('agent_stock',2018,'初三',['第一周卖掉一些，后来点赞的人多，付钱的人少。箱子还在床边，中考日期越来越近。','已卖出的款扣掉邮费到账了。余下几件降价，之前问过的人才愿意拿。'],[C('把余货降价交给已经联系好的人','agent_clear'),C('先收起余货，今晚写卷子','school_offer',flag('agent_inventory'))],6,{enter:gain(210,'部分库存销售净回款（货款此前已付）')});
  N('agent_clear',2018,'初三',['最后一件交出去了。你把拿货、运费和收到的钱减了一遍。','总共收回365，拿货付399，这一次少了34；前面代发的三十仍是真的。','纸箱终于空了，考试也快到了。'],[C('把空箱折好，收起这次的账','end_micro')],6,{enter:gain(155,'清理剩余库存净回款')});
  N('task_first',2018,'初三','S06',[C('把消息发给姐姐，问她做过没有','task_help'),C('按消息垫付398','task_block',pay(398,'兼职任务垫付'),cash(398)),C('回他：今天只接不用垫钱的','school_offer')],5,{enter:gain(17,'兼职群前两单5元及12元到账')});
  N('task_help',2018,'初三',['姐姐看了截图，问你为什么找工作要先把钱转出去。她也不能替你证明群里每个人是谁。','你保存回复，没有把接下来的398转过去。'],[C('把聊天留着，先拿成绩去问学校','school_offer')],5);
  N('task_block',2018,'初三',['约定时间过了，提现没有到账。对方又要求追加，称整组完成才结算。','你翻回最初的承诺，它没有写这一条。姐姐让你把转账和聊天都留下，陪你联系求助。'],[C('把记录发给姐姐，停止新增转账','school_offer',flag('scammed'))],5);
  N('school_offer',2018,'初中毕业','S08',[C('带成绩和费用纸，去问另一所高中','high_fee',{},s=>world(s,'high_eligibility',5)!==0),C('让中职老师写下专业课表、收费和住宿','voc_fee'),C('跟姐姐问岗位、年龄要求和住处','direct_work')],4,{enter:s=>{s.flags.high_eligible=world(s,'high_eligibility',5)!==0;},body:s=>[...T.scenes.S08.body,has(s,'high_eligible')?'另一所普高仍在你可报的范围内，录取与资助要等审核。':'老师核过范围：这一轮，你的分数够不到那所普高。她仍帮你找能报的中职。']});
  N('high_fee',2018,'准备普高',['能报的是另一所离家更远的普高，报名不是加钱买原来学校的名额。','课程能接着走向高考；住宿、吃饭、材料都要筹。老师让你拿家庭材料，核当年可申请的资助。','中职的免学费条件你也问过，但住宿和吃饭仍不全免。两张纸都不是一张通往免费的票。'],[C('带齐材料，按报名日期申请入学与资助','high'),C('把中职专业和费用表拿回去再看','voc_fee'),C('拿工作班次表问住处','direct_work')],4,{enter:flag('high_offer')});
  N('voc_fee',2018,'准备中职',['招生老师展示了实训作品和以前的推荐岗位，说你的成绩来这里会有优势。','学校核过你的农村家庭材料，适用当年的免学费条件。住宿、吃饭、材料仍要准备；补助要申请，推荐也不是保证每个人入职。','你把课表拿给姐姐看。她问毕业能做什么，招生老师又指了一遍合作单位名单。'],[C('按确认的专业和费用递交入学资料','voc'),C('拿两张费用表，继续问可报普高','high_fee',{},s=>has(s,'high_eligible')),C('去看能包住的实际岗位','direct_work')],9);
  N('direct_work',2018,'离校后的住处',['姐姐转来的厂里招聘写着包住、按月发薪。你问还要先花多少钱，对方只说带行李。','你还没满十六岁。有的联系人要求等满龄，有的只是催尽快来。姐姐自己也没去过那条线，先陪你把工作和住处问清。','纸上的工资像是一种立刻不必再求人的办法。'],[C('带班次和住处纸，跟她去问实际到岗安排','factory_intake',flag('left_school')),C('先住姐姐那里，问餐馆的辅助岗位','service_offer',flag('left_school'))],10);
  gate('factory_intake',s=>s.year===2018&&world(s,'underage_recruitment',3)===0?'factory_illegal':'factory_offer');
  N('factory_illegal',2018,'十五岁／非法用工经历',['招聘人知道你的年龄，仍安排你上岗。第一次发工资，也有你的名字。','你十五岁。这样招用未满十六岁的孩子违反规定；这件事没有因为工资发了就变成合法。','校服收在箱子里，工作服从别人那里借了一件。下班时，学校那边还亮着灯。'],[C('收好实际工资和工时记录，做这一轮交接','first_factory_window')],10,{enter:s=>{setJob('工厂辅助工','underage_illegal')(s);period(s,1,1800,1200,'非法用工虚构个案已到账工资与生活费');}});
  N('high',2018,'高一',['你拿到了录取，住进学校。老师帮着办成了一部分支持，饭钱和材料还得自己想办法。','度过如坐针毡的初中三年，贫困的小事没有因为换了一件校服就结束。'],[C('收好课表，把费用通知带回去','high_shame')],4,{enter:all(flag('high'),flag('high_start_year',2018)),narration:7});
  N('high_shame',2019,'高一','S14',[C('下课找以前帮过你的老师','high_help',study(1)),C('给姐姐发：那家厂现在还招人吗','high_factory'),C('回座位，把今天的题做完','high_study',study(1))],4);
  N('high_help',2019,'普高',['老师帮着核了材料，处理了费用的一部分，让你别在班上再解释。','回座位时白印还在。你把那截袖口拉平，重新看题。'],[C('按复习计划做完这周的卷子','high_study',study(1))],4);
  N('high_factory',2019,'离校准备',['姐姐陪你把岗位、住宿和到岗日问清。你已经十六岁，但离校手续和以后能否回来不是她一句话能安排的。','家里没筹出剩余生活费。你把书装进箱子，校服叠在上面。'],[C('带上行李，按核过的日期去报到','factory_offer',all(flag('left_school'),setJob('电子厂工人','high_dropout')))],10);
  N('high_study',2020,'高二',['题做了一沓。兼职留下的钱够一阵，又有下一张费用纸。','咨询老师听你读稿，说声音条件不错，给你看播音课程与往届录取照片。学费外，住宿和考试交通另算。'],[C('拿完整费用表，问一次实际试课','art_course'),C('先用现有资料，按原计划复习','gaokao',study(2))],4,{narration:2});
  N('art_course',2020,'普高／试课',['你拿到完整费用后，只报了自己能承担的这次试课。老师让你重读一处，也指出了不足。','你有所收获，但往届照片里没有每个人的结果。接下来的报名仍要看考试与当年资格。'],[C('留好试课笔记，回去准备实际考试','gaokao',study(1))],9,{enter:s=>{const p=Math.min(100,s.cash);money(s,-p,0,'播音体验课虚构费用');}});
  N('gaokao',s=>Math.max(2021,(s.flags.high_start_year||2018)+3+(s.flags.repeat_count||0)),'高考之后',['你考完了，也查到了分数。老师把当年能填的学校圈出来，提醒往年只能参考。','你先找本科两个字，再往后看费用。先前的复习不会保证每一张通知，但也没有被抹掉。'],[C('带成绩，逐张比较能填的学校','gaokao_gate')],4);
  gate('gaokao_gate',s=>{const r=world(s,'gaokao_'+(s.flags.repeat_count||0),6)+s.study;return r>=5?'bachelor_choices':r>=2?'college_choices':'no_offer';});
  N('bachelor_choices',2018,'填报志愿',['目前分数在这几所本科的可报范围。公办费用较低，名额不稳；民办这所更有机会，费用更高。','专科有不同专业和三年学制。你把总费用而不只第一年学费写到同一张纸上。'],[C('把可报公办排前面，保留替代志愿','admission',flag('degree_choice','public')),C('和家里谈民办费用后填这所','admission',flag('degree_choice','private')),C('比较专科专业和总费用后填表','admission',flag('degree_choice','college'))],9);
  N('college_choices',2018,'填报专科',['这一轮能填的范围是专科，没有一张可以凭意愿拿走的本科通知。','你把专业课、实训和三年费用圈出来。招生推荐工作与毕业时的实际招聘仍是两件事。'],[C('核过专业和总费用后填志愿','admission',flag('degree_choice','college')),C('回已问过的岗位，先去工作','service_offer')],9);
  gate('admission',s=>world(s,'admission_'+(s.flags.repeat_count||0),7)===0?'no_offer':'college_start');
  N('no_offer',2018,'没收到录取',['你又查了一次，仍没有能接受的录取。先前的志愿已经不能再排一次。','复读学校让你带成绩问名额与费用。姐姐也问，要不要先去她那边工作。'],[C('带费用表商量这一年怎么过','repeat_offer',{},s=>!has(s,'sister_stay')&&(s.flags.repeat_count||0)<1),C('给已经问过的招聘联系人回消息','service_offer')],4);
  N('repeat_offer',2018,'复读安排',['老师核了这次的名额。姐姐答应暂供住处，你仍得做能安排的零工。','这一年真的要过去。不是再点一次原来的成绩查询。'],[C('按商量好的吃住和课表准备一年','gaokao',s=>{s.flags.repeat_count=(s.flags.repeat_count||0)+1;s.year++;s.study+=2;}),C('谢过老师，按工作到岗日准备','service_offer')],4);

  N('voc',2018,'中职一年级','S09',[C('先把招聘单位要的作品做完','voc_life',all(learn(1),study(1))),C('给单位问这张证是否需要','certificate_info',learn(1)),C('按已说明的100元费用报名证书课','voc_life',all(pay(100,'证书体验课'),learn(1)),cash(100))],9,{enter:all(flag('voc'),flag('voc_start_year',2018)),narration:7});
  N('certificate_info',2018,'中职',['招聘联系人回复：这次看的是实操作品，不要求这张证。','老师确实指导过你，也把证书说得太笼统。你没因此把他以前的帮助都当假话。'],[C('继续完成要展示的作品','voc_life',study(1))],9);
  N('voc_life',2019,'中职二年级',['老师问你愿不愿意跟搭档备赛。你们同组的学长也会来练实训，课间放自己录的rap。','比赛、上课、喜欢一个人，会在同一段日子里发生。不是四条互相删掉的路。'],[C('跟搭档重新排训练时间','skill_train',study(2)),C('拿费用纸问这次能申请什么帮助','skill_help',study(1)),C('把今天做错的材料拆开重做','rapper')],9,{narration:2});
  N('skill_help',2019,'中职／备赛',['老师垫了这次一段车费，材料要早做。搭档把晚班换到周末，空出一次练习。','你们重新排好时间，不知道评审会给几分，但手里的作品能继续改。'],[C('按这份时间表练完，带作品参赛','competition',study(2)),C('做完这次作品，回实训课','rapper')],9);
  N('skill_train',2019,'中职／备赛','S12',[C('拿材料与搭档继续练，按通知参赛','competition',study(2)),C('把要挣钱的班次告诉老师，商量补练','rapper',study(1))],9);
  gate('competition',s=>s.study>=4&&world(s,'judging',4)!==0?'award_result':'competition_missed');
  N('award_result',2020,'省赛之后',['你找了几遍名单，看见自己的名字在二等奖那一栏。','回程车上，老师让你别折奖状。你抱在腿上，一路没睡。'],[C('把奖状放平，带回学校','end_award')],9);
  N('competition_missed',2020,'省赛之后',['这次没有获奖。评语指出了两处问题，老师让你把文件留下，下回能接着做。','回校后，学校的实习通知已经发进群里。'],[C('收好作品和评语，查看实习通知','forced_intern')],9,{enter:learn(1)});
  N('rapper',2019,'中职','S10',[C('回他：四点训练完，你等得了吗','cinema'),C('说这周赶作品，问下周还放不放','voc_next',flag('rapper_friend'))],7);
  N('cinema',2019,'中职／周末',['他真的等到你训练完，先陪你买了点吃的。你们去了学校后面那家私人影院。','你喜欢的是，自己随口说过的电影被他记住了。看完以后，他问要不要正式交往。','你还没想好所有后面的事。回校时间写在手机上。'],[C('答应交往，按说好的时间回校','romance_months',flag('dating')),C('说今天只看电影，改天一起吃饭','voc_next',flag('rapper_friend'))],7);
  N('romance_months',2020,'中职／恋爱',['你们交往了一段时间。他陪过你改作品，你也去听过他唱歌。','亲密的事后来发生过。你以为自己知道如何防护，有一次却没有确认好。','这阵子身体变化，你去做了检查。结果不是答应看电影就决定了的。'],[C('去取已经做好的检查结果','pregnancy_gate')],8);
  gate('pregnancy_gate',s=>world(s,'pregnancy',3)===0?'pregnancy':'no_pregnancy');
  N('no_pregnancy',2020,'中职',['这次检查没有怀孕。你把单子收好，和他把先前没说清的事谈了。','实训作品还在，实习通知也来了。'],[C('回课室，按日期处理学校通知','forced_intern')],8);
  N('pregnancy',2020,'中职','S11',[C('留下来，告诉同学检查结果','preg_help'),C('给老师发：能不能先不在班里说','preg_help'),C('把检查单收回书包，今天仍去上课','preg_delay')],8);
  N('preg_help',2020,'中职／求助',['同学没有立刻给你一个答案，先问有没有人陪去医院。老师等办公室没人时听你说，联系了姐姐。','她们陪你获得医疗评估，再分别处理家庭与学校安排。费用和学业不是发送消息就都解决，但有人开始和你一起跑。','这段经历过后，学校明确了你能继续课程的安排。'],[C('按商量好的课程安排收好材料','forced_intern')],8,{narration:7});
  N('preg_delay',2020,'中职',['又过了几个月。学长说先别让家里知道，你也怕老师先打那通电话。','同学问身体变化，你说只是最近吃多了。问完她走开，你想追上去，最后还是回座位。','今天姐姐发来消息，问最近怎么不打电话。'],[C('把检查结果发给姐姐，请她陪你','preg_help'),C('回她：没事，先把今天的课上完','preg_later')],8);
  N('preg_later',2020,'中职',['日子继续过去。宽衣服也越来越难遮住，你避开一起换衣服的时间。','你给老师打过一句“我想说件事”，又在她回复前删掉。同学第二次问，你仍没承认。','那天腹痛加重，你请假走向厕所。'],[C('停下脚步，给老师发已经藏了很久的事','preg_help'),C('先走进厕所，想等这一阵过去','toilet_event')],8);
  N('toilet_event',2020,'中职／医疗救助',['你在学校厕所里分娩。门外的人发现异常，叫来老师和医疗救助。','有人问你怀孕多久了，你终于回答。班里的课本还没有收。','这次隐藏不了的事实，需要大人和医护继续处理。'],[C('把检查和这些月的情况告诉医护','end_toilet')],8);
  N('voc_next',2020,'中职',['你把作品交了。学长仍和你一起去食堂，老师仍催实训。','群里发来实习通知：集合时间、车、企业都安排好，名单里有你。'],[C('点开通知，核对自己的名字','forced_intern')],10);
  N('forced_intern',2020,'中职／学校实习安排','S13',[C('带报名日期问班主任，两件事怎么安排','intern_coordinate',flag('asked_exam')),C('把通知发给家人，请他们一起问','intern_coordinate',flag('family_coordinate')),C('按集合时间收行李，问到厂后谁排工位','intern_factory')],10);
  gate('intern_coordinate',s=>world(s,'intern_coordination',3)===0?'intern_refused':'voc_exam_offer');
  N('intern_refused',2020,'中职／实习安排',['家人也打了电话。负责的人仍要求先集合，只把报名日期记下，说到时再协调。','通知没有变成一次自愿报名。你把回复和排班都留了下来。'],[C('按集合时间去，带上报名材料','intern_factory',flag('asked_exam'))],10);
  N('intern_factory',2020,'中职／企业实习',['宿舍钥匙发了。第二天按排班上工，先学的是在哪打卡、什么时候交接。','你把工时和材料按日期留下。报名窗口到了，有了能去交材料的安排。'],[C('按核过的窗口去交升学材料','voc_exam_offer',{},s=>has(s,'asked_exam')||has(s,'family_coordinate')),C('把实习做完，问毕业后的留用与工资','voc_finish')],10,{enter:s=>{setJob('实习工人','school_intern')(s);period(s,2,2100,1700,'中职实习的虚构个人收支');}});
  N('voc_exam_offer',2021,'中职／升学报名',['老师把当年你这个专业能报的范围写出来。不是所有本科和专科都在这份名单里。','实习材料怎么交也协调了日期。你按这个窗口报名，准备实际考试；没录取仍要用已学的技能找岗位。'],[C('按公布条件报名，照计划复习','voc_exam_result',study(2)),C('先完成实习，按已有岗位找工作','voc_finish')],9);
  gate('voc_exam_result',s=>world(s,'voc_exam',5)+s.study>=3?'voc_admit':'voc_finish');
  N('voc_admit',2021,'中职毕业／专科录取',['专科通知真的到了。班主任把材料退给你，让你别漏了资助申请。','你把下一段学费、住宿和饭钱分开抄。要继续读，仍要钱。'],[C('按录取要求整理入学材料','college_start',flag('degree_choice','college'))],9);
  N('voc_finish',2021,'中职毕业',['毕业材料处理完了。厂里核过留用，岗位还是那张排班。','你的作品和技能能写进简历，不等于现在有一份立刻更好的工作。'],[C('按谈好的工资留在现有岗位','factory_life'),C('给本地招工联系人发作品和到岗日','service_offer')],10,{enter:setJob('电子厂工人','voc_graduate')});

  N('college_start',2018,'大学／录取材料','S17',[C('按通知准备能申请的资助材料','college_funding'),C('给暑期老板问工资结算日，一并问资助','college_funding'),C('把缴费纸给家里看，先筹眼前这笔','college_funding')],9,{enter:s=>{const d=s.flags.degree_choice||'college';s.flags.degree=d;s.flags.college=d==='college';s.flags.university=d!=='college';s.flags.private=d==='private';s.flags.college_start_year=s.year;s.flags.grad_year=s.year+(d==='college'?3:4);s.flags.left_school=false;s.flags.job='';}});
  N('college_funding',2018,'大学／开学前',['材料补齐了。学校核定了这次的支持，你按通知办理报到。','本故事的学费缺口由助学借款直付学校，不会变成手里可随便花的钱。住宿先由已谈好的家庭分担，饭钱仍靠自己。','你拿到课表，食堂招人的周三班正好撞课。'],[C('把课表发给食堂，问只排周末行不行','campus_choices')],4,{enter:s=>money(s,0,s.flags.private?12000:s.flags.college?3000:4000,'第一学年虚构学费缺口，借款直接付学校') ,narration:7});
  N('campus_choices',s=>s.flags.college_start_year||2021,'大学／课表与兼职',['周末的班谈好了，月底按做完的工时结。','同学发来一份兼职信息。你还有课要上，不可能把每个机会都接满。','你拍了开学以来的几张日常，想知道有人会不会和你有同样的感受。'],[C('按周末课表做班，留下日常记录','campus_work',flag('creator')),C('点开同学发来的那份兼职信息','campus_info'),C('拿专业作品去问实习空缺','internship',learn(1)),C('继续发记录，查别人问到的问题','creator_accumulate',all(flag('creator'),learn(2)))],5,{enter:s=>period(s,4,1500,1050,'大学周末兼职与个人日常支出')});
  gate('campus_info',s=>['model_offer','play_start','billiards','campus_small','shoe_offer'][world(s,'campus_offer',5)]);
  N('campus_work',2018,'大学／兼职',['店里请假时你顶过班，带过一个新人。课表仍决定你能来的日期。','购物车里那支圣罗兰398，你看了三天。买了还能吃饭，只是这个月不能再随便花。','你留了一些生活帖，偶尔十三个赞。有同学问你兼职消息是从哪来的。'],[C('付款买这支，留下这一次快乐','lipstick',pay(398,'口红虚构故事价格'),cash(398)),C('把旧手机卖给试过屏幕与充电的人','secondhand'),C('把下一轮课表发给店里，准备实习与毕业','internship',learn(1)),C('继续写记录，把留言里的问题查清','creator_accumulate',all(flag('creator'),learn(2)))],11);
  N('lipstick',2018,'大学',['你先涂了一次，又拿手机拍。照片没发，但留着。','晚上去食堂前，你把口红盖好放回抽屉。工资仍是你按工时赚的，喜欢这件东西也是真的。'],[C('拿好课表，按已约的时间去实习面试','internship',learn(1))],11);
  N('secondhand',2018,'大学',['买家当面试了屏幕和充电。500到了，你退出旧账号，才把手机交过去。','这是把已有的东西换成钱，不是凭空赚了五百。'],[C('收好到账记录，继续课表与实习','internship',learn(1))],5,{enter:all(gain(500,'出售旧手机所得（已有资产变现）'),flag('old_phone_sold'))});
  N('campus_small',2018,'大学／小批订单',['同学问那件用品还有没有。你先看库存，再回复。','这一小批货需要300，订单已有几单；没有付钱的问价不能也算卖出。'],[C('按确认的小批清单付货款，完成订单','campus_small_done',pay(300,'校园小批用品采购'),cash(300)),C('只把已经整理的需求给供货人，先不拿货','internship')],6);
  N('campus_small_done',2018,'大学／小生意',['进货、邮费和退款核完了。这一批收回510，减掉先付的300，留下210。','下一笔材料费，你没有再打电话回家。'],[C('交了材料费，把剩下的放回罐子','end_small',pay(60,'学校材料费'),cash(60)),C('把交付和售后记录留下，联系中控招聘','hangzhou',flag('selling')),C('按已有顾客问补货，不增加没有订单的量','ecom_start',flag('selling'))],2,{enter:gain(510,'校园订单扣邮费退款后的回款（采购已另记）')});
  N('shoe_offer',2018,'大学／卖货信息','S25',[C('问他能提供哪些来源凭据','shoe_check'),C('回复顾客：还没确认，先别付款','internship'),C('按他发来的清单拿这一小批','shoe_problem',pay(600,'供应方宣称渠道鞋的小批货款'),cash(600))],6);
  N('shoe_check',2018,'大学',['上家没提供可核的来源，仍把照片说得很好。你没有对顾客承诺已经验证。','同学问那件普通用品还有没有，上一批的单据你还能查。'],[C('把普通用品清单拿出来，先核订单','campus_small'),C('把这条消息放下，回到课程和实习','internship')],6);
  N('shoe_problem',2018,'大学／售后',['顾客收到后质疑。你带实物核查，查到这批是仿冒品。','上家先说换货，后来不回。你先把自己已经收过的钱退给顾客，没把这批继续卖。','还没卖出的货不能按原来报价当现金。'],[C('保存证据，处理售后，回去上已排的班','internship',flag('shoe_inventory'))],6);
  N('creator_accumulate',2018,'大学／日常记录','S42',[C('记下留言的问题，查过后更新这篇','creator_device',all(flag('creator'),learn(2))),C('先按课表做班，晚上再整理记录','internship',all(flag('creator'),learn(1)))],12,{body:['你发了一些大学生活。十三个赞，也有一个都没有的。偶尔有人认真问一句，你会再查资料，把说不清楚的地方改掉。','你的手机能写，做页面还需要电脑。同学让你先试学校机房，不必看见“做产品”就买全套设备。']});
  N('creator_device',2018,'大学／自学',['机房里你试了几个小页面。回住处后，用手机记下报错，明天再看。','同学帮着试过一台900元旧电脑：能开编辑器，也能运行这一小份项目。买下之后还得留生活费。'],[C('按试过的情况付900，留下生活费','creator_later',all(pay(900,'试过的旧电脑'),flag('computer')),cash(1500)),C('按机房开放时间继续，先去做班攒钱','creator_saving')],12);
  N('creator_saving',yearPlus(1),'大学／兼职与自学',['你按能到的班挣钱，做了半年，也按课表学东西。','这段时间留下1200，生活支出已经另外付过。现在那台试过的旧电脑仍在。'],[C('按试过的机器付900，把余钱留作生活','creator_later',all(pay(900,'开发用旧电脑'),flag('computer')),cash(900)),C('继续用机房，把实际作品带去面试','internship',learn(1))],12,{enter:s=>period(s,6,1500,1300,'攒设备钱的兼职')});
  N('creator_later',s=>s.flags.grad_year||2025,'毕业／作品与工作',['学业完成了。你把确实做过的作品放进简历，先接上一份能做的工作。','账号仍更新。有人说没用，也有人说自己以前没这么想过。','2025年以后，你看见有人把借助AI做东西的方式叫Vibe Coding。'],[C('保留工作与项目，回去改那个存档按钮','creator_prepare',{},creative),C('把作品给中控招聘联系人，核岗位内容','hangzhou'),C('按现在的班挣钱，先处理眼前生活','work_window')],12,{enter:s=>{setJob(s.flags.degree==='college'?'客服':'内容助理','graduate')(s);period(s,3,3800,3000,'毕业后起步工作');},narration:3});
  N('internship',s=>Math.max((s.flags.grad_year||2025)-1,s.year),'大学／实习','S19',[C('把作品和到岗时间发给实习联系人','intern_result',learn(1)),C('问本地同类岗位有没有实习空缺','intern_result',learn(1)),C('续本月兼职，给面试留半天','intern_result')],12,{body:s=>s.flags.college?['实训作品终于有人认真问了。面试的人让你按任务改一处文件，说下周反馈。','补贴不高，异地还要住处。原来兼职的店也问下个月来不来，那里月底能拿多少你比较清楚。']:T.scenes.S19.body});
  gate('intern_result',s=>world(s,'intern_offer',4)!==0?'graduate_offer':'graduate_search');
  N('graduate_offer',s=>s.flags.grad_year||2025,'大学毕业',['面试后单位给了岗位：客服和订单整理，你做过的实训用得上一部分。','你把剩余学业办完，按约定交接。学历不是立刻变成行政岗的按钮。'],[C('按岗位工资和到岗日交接，先工作','graduate_window',setJob('客服','graduate')),C('专科报名窗口到了，核能报的专业','upgrade_offer',{},s=>has(s,'college')),C('带相关任务记录，去问中控夜班','hangzhou',flag('selling'))],10);
  N('graduate_search',s=>s.flags.grad_year||2025,'大学毕业',['实习结束，单位说暂时不招。作品能写进简历，但还得继续面试。','原店能继续排班。你没有被改成从没上过大学的人，学费借款也仍在。'],[C('先续已确认的班，继续投岗位','graduate_window',setJob('店员','graduate')),C('专科核过报名范围，安排升本准备','upgrade_offer',{},s=>has(s,'college')),C('把已有内容与商品经验发给中控联系人','hangzhou',flag('selling'))],10);
  N('graduate_window',2018,'毕业／开始工作',['工资开始按月到账。租住处和饭钱付掉，余下一点；这几年借过的学费仍在账上。','同事转来一条实际消息，你按自己已有的经历去看。'],[C('交完本月费用，查看这条来讯','work_window'),C('把晚上的生活记录更新，查一个新问题','creator_after_job',all(flag('creator'),learn(2))),C('把可做的日期发给原店，问带班空缺','tea_offer')],10,{enter:s=>period(s,6,3800,2800,`${jobRole(s)}起步工资`)});
  N('creator_after_job',2018,'工作／持续记录',['账号没有立刻带来很多钱。你做过几次小页面，终于知道别人问的问题里，有一部分能做成工具。','机房或电脑的时间是真实安排出来的。没设备不能只靠这一句愿望。'],[C('用已有电脑，回去复现那个问题','creator_prepare',{},creative),C('按试过的情况买900元旧电脑','creator_prepare',all(pay(900,'开发用旧电脑'),flag('computer')),s=>college(s)&&!has(s,'sister_stay')&&s.year<=2026&&s.cash>=1500),C('先保留作品，按现有班工作','work_window')],12);
  N('upgrade_offer',s=>s.flags.grad_year||2024,'专科毕业／升本','S18',[C('问店里能否换班，按范围交报名材料','upgrade_exam',study(2)),C('按现有资格报名，照已有计划复习','upgrade_exam',study(1)),C('续现有岗位，这次不报名','graduate_window')],9);
  gate('upgrade_exam',s=>world(s,'upgrade_exam',5)!==0&&world(s,'upgrade_exam',5)+Math.min(s.study,2)>=3?'upgrade_admit':'upgrade_missed');
  N('upgrade_missed',2018,'专科毕业',['这次没有录取。你做过的复习和专科学业仍在，不是点错一项就变成了没读书。','原岗位确认了能回去的日期。'],[C('带上简历，按日期回岗位','graduate_window')],9);
  N('upgrade_admit',2018,'升本录取',['录取通知到了。这两年需要继续上课，不能同一页就拿到本科证。','你按材料核了学校支持，缺口仍是直接付学校的学费借款。兼职要按新的课表排。'],[C('办报到，按新课表完成这两年','upgrade_finish')],9,{enter:s=>{s.flags.upgrade_start=s.year;money(s,0,8000,'两年升本虚构学费缺口，直付学校');}});
  N('upgrade_finish',s=>(s.flags.upgrade_start||2024)+2,'本科毕业（专升本）',['两年的课程和毕业要求完成。证拿到了，你仍要准备下一份工作的费用。','生活记录没有完全停。你留着旧作品，也留着原来真学过的东西。'],[C('按已有作品投能做的岗位','graduate_window',setJob('客服','upgrade_graduate')),C('保留工作，把已做的项目继续改','creator_prepare',{},creative)],12,{enter:all(flag('university'),learn(1))});

  // Sister/front-desk continuity is separate from the graduate/creator path.
  N('front_entry',2022,'十九岁／洗浴会所前台',['姐姐问到的是洗浴会所的前台。工作登记、收钱、接电话，夜班站得久；工资和休息日写在纸上。','这几年你做过家务，也在店里帮过工。上学那条旧路已经停了，不会因为下一份工作换了名字就自动回大学。'],[C('按工资与班次试岗，学登记和交接','front_paid'),C('问包住餐馆的白班，按核过的日期去','service_offer')],null,{art:9,enter:setJob('洗浴会所前台','sister')});
  N('front_paid',2022,'洗浴会所前台',['工资发过两次。站夜班腿疼，但这次房租不用借姐姐的钱。','负责人让你送茶上楼：“小玲在，你跟她去，前台我先看着。”小玲教过你交班。'],[C('端着茶，跟小玲上楼','front_up'),C('说这笔账没对完，问能否等一下','front_wait')],null,{art:9,enter:s=>period(s,2,3200,2300,'前台已完成的两个月班次'),narration:3});
  N('front_wait',2022,'洗浴会所前台',['负责人让另一个人送。你把当晚的账对完，下一次仍按前台表交班。','后来新来的问七号柜在哪里，你已经不用查那张纸。'],[C('教她核号牌，把这班的账交好','end_reception')],null,{art:9});
  N('front_up',2022,'洗浴会所／楼上接待',['你放下茶正要走，小玲拉开椅子，让你帮倒倒酒，马上散。前台确实有人替着。','你坐了一阵，客人聊的是你知道的县城和学校。散场，小玲转了200，你问是不是从工资扣，她说不扣。','两天后，她说那几位又来，认得你。'],[C('问她：还是上次那几个人吗','front_repeat'),C('回她：我今晚前台十点交班','front_return')],null,{art:11,enter:gain(200,'首次楼上接待实得小费')});
  N('front_return',2022,'洗浴会所前台',['她问十点以后能不能来。你把已经排好的前台表发过去，说今晚先做这一班。','下一轮表仍是登记和收银。你没突然欠一笔钱，也没有因没接邀约失去这份岗位。'],[C('按前台表做完这一轮交接','end_reception')],null,{art:9});
  N('front_repeat',2023,'会所接待',['确实还是那几位，后来又有他们带来的朋友。你从送茶，到坐下陪聊喝酒，排表里前台的时间越来越少。','钱比原来多，也是真的发。散场更晚，房租和衣服开始按这份收入安排。小玲问下周哪几天能来。'],[C('发能来的日期，核上次结算','front_beyond'),C('问已做的班什么时候结，给原餐馆问白班','front_settle')],null,{art:11,enter:s=>period(s,4,6500,4400,'会所接待虚构个案的收入与生活支出')});
  N('front_beyond',2023,'会所陪酒接待',['你现在主要陪客人聊天、喝酒，已经很少在楼下做收银。下周的接待名单也排上了你的名字。','上次的钱结清，房租付了。客人又发消息来，小玲问你下次几点到。','你熟悉他们爱听什么，也开始按这份比前台高的收入安排生活。'],[C('把下次班期记进日历','end_beyond')],null,{art:11});
  N('front_settle',2023,'离开会所前',['还要做完已经接的两班。结算少了一项，你拿原记录问清，补齐后才交钥匙。','原餐馆回复有白班，你看过住处和到岗日，押金从手里的钱付。不是一句不做了就有地方去。'],[C('还钥匙，按已经确认的新班期准备','end_lastnight')],null,{art:10,enter:s=>{const p=Math.min(s.cash,500);money(s,-p,0,'下一份住处的押金');}});

  N('service_offer',2019,'问工作的工资和住处',['餐馆招辅助店员，核年龄、班次和报酬。包吃，宿舍床位有限，夜班回来要轻点。','你看过住处，工资要到月末。手里的余钱得先撑到那一天。'],[C('按核过的到岗日试班，留好工资约定','service_paid'),C('问电子厂的实际工位、宿舍和年龄要求','factory_offer')],14,{enter:s=>{if(!college(s))s.flags.left_school=true;setJob('餐馆店员',college(s)?'graduate':'school_leave')(s);}});
  N('service_paid',yearPlus(1),'餐馆店员',['工资发过，收盘、补料、结账也熟了。包吃解决一部分开销，夜班仍要按别人排的表。','朋友把一份已经问过的招聘转来。不是所有城市、行业都在这一条消息里。'],[C('把这月费用付好，看看朋友这条消息','work_window'),C('给奶茶店联系人问工资和休息日','tea_start')],14,{enter:s=>period(s,8,2700,2050,'餐馆店员工作收支')});
  N('factory_offer',2019,'第一张工牌',['宿舍看过了，工位与报酬也问了。你满十六岁；这张工牌不能把离校以后失去的学习时间还回来。','下班时，学校那边还亮着灯。你在这一批人里年纪最小。'],[C('收好工牌，做完已经安排的第一轮班','first_factory_window')],10,{enter:s=>{if(!college(s))s.flags.left_school=true;setJob('电子厂工人',has(s,'high')?'high_dropout':'early_work')(s);period(s,1,2400,1800,'第一轮工厂工资与生活费');}});
  gate('first_factory_window',s=>world(s,'first_factory_window',4)===0?'end_young':'factory_life');
  N('factory_life',2022,'电子厂工人',['新来的问怎么交接。你说了一遍，又站在旁边看他做。','同一处工位，你已经待过几轮。下班以后有人吃饭，有人玩手机，你偶尔把没说完的一句话记下来。'],[C('照原班交接，教新人把这一件做好','factory_event'),C('把今天没说完的那句话写进本子','writing'),C('拿已经问到的招聘，核换工位的日期','service_offer')],10,{enter:s=>{setJob('电子厂工人',s.flags.work_origin||'factory')(s);period(s,12,3600,2700,'工厂一年个人收支');},narration:2});
  gate('factory_event',s=>['factory_regular','supervisor','injury','coin_first'][world(s,'factory_event',4)]);
  N('factory_regular',2024,'电子厂工人',['新人已经能自己交接，又问你在这里多久了。你想了一下才回答。','这个月的工资到账，宿舍和饭钱付完。你把自己的那副手套收好。'],[C('按原班把手里的活做完，交给下一班','end_factory')],10);
  N('injury',2023,'工厂／伤后治疗','S27',[C('请能联系的人陪着跑手续','injury_wait'),C('把现有票据按日期收好，问还缺什么','injury_wait'),C('问恢复以后有没有适合身体的工位','injury_wait',flag('asked_light_work'))],8,{enter:all(flag('injured'),s=>money(s,0,2000,'先垫治疗生活的真实借款（虚构个案）'))});
  N('injury_wait',2023,'治疗与手续',['材料交了，还在等待。原工位已经让别人接，你先照医嘱恢复。','几个月后，这笔特定个案的赔付确实到账。先前借的治疗生活费也要还。','恢复后的岗位要重新谈，不是受一次伤就买到了以后所有的路。'],[C('请家人接你回能住的地方，先恢复','injury_home'),C('按已问到的适合身体的工位试岗','recovery_work')],8,{enter:s=>{money(s,12000,0,'个案赔付实际到账（非赔付标准）');money(s,-2000,-2000,'归还治疗生活垫款');},narration:8});
  N('injury_home',2024,'回乡恢复',['家里确有能住的地方。恢复后，你跟着家人收菜，力气不够的活仍由别人做。','第一次赶集，摊费和路费付了，菜也卖完。不是拿一笔补偿就自动做成了生意。'],[C('把今天的零钱数清，收好空菜篮','end_market')],null,{art:21,enter:gain(85,'赶集销售扣摊费路费后的净收入')});
  N('recovery_work',2024,'适应新岗位',['单位按当前身体能做的事情安排了交接。你试过几天，不能做的说清了。','报酬少一点，今天的吃住有了安排。'],[C('按谈好的班把本月的工作做完','ordinary_paid')],10,{enter:all(setJob('轻工位工人','recovery'),s=>period(s,2,3000,2400,'恢复后的适应岗位'))});
  N('writing',2024,'工厂／下班写作','S28',[C('按刊物公布的收稿地址寄出作品','writing_response'),C('先把今天这段记完，明天还要上班','end_writing')],null,{art:18,body:['下班后，你把白天没说完的一句话记下来。写了几个月，有些删了，有些还在。第二天照常打卡。','同事看了两行，问你写这个能不能挣钱。你说还不知道。','刊物有公开收稿地址，能寄自己的作品；投稿不等于刊用。']});
  gate('writing_response',s=>world(s,'editor_reply',4)===0?'writing_wait':'writing_editor');
  N('writing_wait',2024,'工厂／写作',['这次没有刊用。编辑回复有一段可以继续改，你把原稿留下。','今天仍要上班。晚上那行字，暂时没有交给任何人。'],[C('把还想写的那句记下','end_writing')],null,{art:18});
  N('writing_editor',2025,'工厂／作品发表',['编辑问能不能用真名。文章出来，有人采访，有人叫你工人诗人。','你高兴，又发现他们常只问自己想听的那一部分。你写的是自己的日常，不是另一位诗人的传记。'],[C('核署名和稿费，把刊物带回住处','writing_factory_reply')],null,{art:19,enter:gain(600,'虚构刊物稿费实得')});
  gate('writing_factory_reply',s=>world(s,'factory_response',2)===0?'writing_dismissed':'writing_contract');
  N('writing_dismissed',2025,'作品发表之后',['办公室指着其中一段，问是不是写他们，让你联系编辑删改。你说明那是自己的日常。','后来收到不用再到原岗位上班的通知。工资和手续还得处理，刊物上的名字不能替你付下月房租。'],[C('收好通知和工资记录，给下一份招聘回信','end_byline')],null,{art:19,enter:flag('lost_factory_job')});
  N('writing_contract',2025,'厂方宣传邀约',['另一种回应是宣传合作。对方希望把诗放在厂门口，让你按约写介绍，实得报酬另算，原工位仍排班。','这和自己的记录不完全一样。第一次有人愿意为你的字付钱，还是让你高兴。'],[C('核清具体要写的稿，签这次合作','writing_signed'),C('把不想删的那一段告诉编辑，仍写自己的','end_writing')],null,{art:20});
  N('writing_signed',2025,'工厂／宣传合作',['稿做完并结算了。有人用那个名头介绍你，你点了点头。','厂门口有你的诗。进去，仍要刷自己的工牌。'],[C('把工牌拿出来，按原班进厂','end_sign')],10,{enter:gain(1500,'已交付厂方宣传合作实得稿费')});
  N('supervisor',2022,'成年／工厂','S29',[C('告诉他下班时间，答应一起吃饭','supervisor_months'),C('说今天想自己待着，明天照原班上工','factory_regular')],14,{narration:6});
  N('supervisor_months',2023,'工厂／交往',['你们吃过几次饭。他说没有结婚，问同住时，也把房租和各自班次谈了。','有一次你说没想好，他退开，第二天没有收回先前的帮忙。你开始期待手机亮，又怕高兴得太明显。','后来同事问起你们的关系，你听到了一件以前不知道的事。'],[C('和同事核时间，再找他谈实际安排','supervisor_truth')],14);
  gate('supervisor_truth',s=>world(s,'supervisor_married',2)===0?'supervisor_honest':'supervisor_photo');
  N('supervisor_honest',2023,'工厂／共同生活',['这次核过的情况和他说的一致，没有另一个婚姻。','你们各自有工资、各自的班，把住处和家务说到能实际做的程度。'],[C('按谈好的开销住一起，仍上自己的班','end_badges'),C('保留自己的住处，按原工位交接','factory_regular')],10);
  N('supervisor_photo',2023,'工厂／发现隐瞒',['同事给你看婚礼合照。日期在他说没有结婚之前，你先核日期，又放大脸。','先前饭、调班和等待都是真的，他隐瞒的婚姻也是真的。你没办法用其中一个把另一个抹掉。'],[C('把照片发给他，问之前为什么那样说','supervisor_reply'),C('问已看过的出租房，何时能拿钥匙','new_lock'),C('今晚先回共同住处，当面问这件事','same_bed')],5,{narration:9});
  N('supervisor_reply',2023,'工厂／共同住处',['他说早就没感情，但没有给出先前那句没有结婚的解释。','明天的班照常。你有自己的工资，找住处要押金，还得决定哪天搬。'],[C('跟房东核押金和日期，结自己的工资搬过去','new_lock'),C('先按原来住处过这个月，把未说清的事留着','same_bed')],5);
  N('new_lock',2023,'工厂／新的住处',['房东收了这次约定的押金，钥匙拿到手。你把行李和自己的工牌一起搬过去。','门能锁上。那件事没有让你一夜什么都没有，拿钥匙也没有把难受清掉。'],[C('锁好门，设明天上班的闹钟','end_lock')],null,{art:44,enter:s=>money(s,-Math.min(s.cash,600),0,'搬家及住处押金')});
  N('same_bed',2023,'工厂／共同住处',['今晚仍回这里。你把照片拿给他看，对话没谈出一个能让你相信的答案。','房租和下个班仍要安排。闹钟响时，谁都没有继续昨晚的话。'],[C('拿好自己的工牌，先去今天的班','end_bed')],null,{art:45});

  N('tea_start',2022,'奶茶店试班',['店员教你封口、补料。忙起来，你弄乱过杯序，她让你先把已做好的一杯交出去。','工资和排班核过了。没有管理经验的你，先做的是店员。'],[C('按核过的班做，记录这次工资与工时','tea_offer')],null,{art:23,enter:s=>{setJob('奶茶店员','service')(s);period(s,6,3200,2400,'奶茶店店员工作收支');}});
  gate('tea_offer',s=>has(s,'tea_experience')?'tea_manager_offer':'tea_start');
  N('tea_manager_offer',2023,'奶茶店','S20',[C('问清调整后的工资和日期，接排班表','tea_manager'),C('说现在只能做原来的班，按原工资结算','ordinary_paid')],null,{art:23});
  N('tea_manager',2024,'奶茶店店长',['新职责和实得工资都确认了。缺人的班先由你想办法，管理不是免费给的一张头衔。','新人问明天几点来。你翻表，发现现在等答案的人是你。'],[C('把核过的班表发给明天来的人','end_tea')],null,{art:23,enter:s=>{setJob('奶茶店店长')(s);period(s,3,4300,2800,'带班后的真实到账工资');}});
  N('model_offer',2022,'成年／兼职试镜','S21',[C('问最近这场有没有新人，谁派工作','model_activity_check'),C('按套餐付款拍照','model_wait',pay(1980,'模卡拍摄套餐虚构费用'),cash(1980)),C('存好试镜照片，回原来的班','ordinary_paid')],null,{art:15});
  gate('model_activity_check',s=>world(s,'model_real_activity',2)===0?'model_activity':'model_terms');
  N('model_terms',2022,'兼职询问',['对方说先做模卡，再由客户挑人。给的活动照片没有这一场派你的名单。','照片会交付，工作却没有写成已确定的承诺。你还是喜欢刚拍出来的样子。'],[C('按套餐付1980拍照','model_wait',pay(1980,'模卡套餐'),cash(1980)),C('存好试镜照片，先上原班','ordinary_paid')],null,{art:15});
  N('model_wait',2023,'等兼职通知',['照片交了，确实好看。第一周等通知，第二周说档期不合。','你把空出来的周末排回原岗位，没有因为拍了照片就自动去下一处会所。'],[C('把照片收好，确认周末原班','end_model')],null,{art:15});
  N('model_activity',2022,'实际活动邀约',['联系人给了这次活动的时间、迎客和带座任务、报酬与结算日。没有要求先做套餐。','认识的人说会和你一起过去，散场也一起回。你核过这次确实有这份工作。'],[C('发能到的时间，按名单去做这次接待','flower_first'),C('原来的班已排好，把日期发给原店','ordinary_paid')],null,{art:46});
  N('flower_first',2023,'成年／活动接待','S22',[C('问她几点开始，能否一起过去','flower_paid'),C('说原夜班已排，问能否换一天','flower_paid')],null,{art:46,body:T.scenes.S22.body});
  N('flower_paid',2024,'花场接待',['做过一段时间。有个月扣完衣服、介绍费、交通和生活，留下8000；以前一月留600。','你拿计算器按两年：如果每月都这样，是旧工作二十六年多的积蓄。你知道还没有每个月都这样，房租和衣服却已照这个数安排。','传统要求你忍耐的那份体面，没替你交过一张账单。你第一次认真怀疑，它为何只在你这里这么贵。'],[C('发下周能去的日期，核这次扣款','flower_list'),C('问原店下月的白班，做完已接场次','flower_exit')],null,{art:46,enter:s=>period(s,3,13000,5000,'花场接待虚构个案收入及全部个人支出')});
  N('flower_list',2024,'花场／固定邀约',['扣款对清，下一次仍有你的名字。你已知道那几位的习惯，也学会挑对方愿意听的部分聊。','钱让你不再每次先担心账单，生活又渐渐照它安排。'],[C('把下次的衣服挂好，核日期','end_guestlist')],null,{art:46});
  N('flower_exit',2024,'已接场次与下一份班',['原店白班和住处都核过了。你做完接下的两场，核齐介绍费、服装费和实际结款。','押金付过，新岗位确认了到岗日。下一次邀请仍来，但你没有再回日期。'],[C('收好结算，按新到岗日准备','end_afterparty')],null,{art:47,enter:s=>money(s,-Math.min(600,s.cash),0,'下一份工作的住处押金')});
  N('play_start',2022,'成年／游戏订单',['第一单对方只让你一起打游戏。时间到了，你问还开不开，他续了半小时。','后来熟客问，不打游戏，聊天能不能也按小时。你先看自己的排班，能接的时间有限。'],[C('发下次能打游戏的时间','play_paid'),C('问聊天这单如何计时与结算','play_paid'),C('说今晚有班，完成已约的这单','play_paid')],null,{art:39});
  N('play_paid',2022,'陪玩订单',['实际做完的订单按时间结算，扣掉约定费用，实得120。不是整晚在线都算收费。','耳机摘下，房间已安静。你看明天还能接哪段时间。'],[C('把已确认的时间发给下次客户','end_play')],null,{art:39,enter:gain(120,'完成游戏订单实得报酬')});
  N('billiards',2022,'成年／台球厅试岗',['朋友介绍球厅缺助教。负责人教你摆球、握杆，说明陪练、接待与排班。衣服和球杆哪些自备写在清单上。','做过一周，知道有人爱聊天，有人只想练球。下班前把球杆放回架子，再换回自己的衣服。'],[C('按实际工时核这周的钱，交好球杆','end_billiards')],null,{art:16,enter:s=>{setJob('台球厅助教','parttime')(s);gain(420,'台球厅已完成一周工作实得')(s);}});
  N('foot_offer',2022,'成年／生活账号','S24',[C('回复：想要什么，照片用在哪里','foot_terms'),C('按自己愿意的非露骨内容谈一次','foot_paid'),C('不回这条，发原本的日常','ordinary_paid')],5,{enter:flag('creator')});
  N('foot_terms',2022,'生活账号',['你把内容和用途问明。只谈自己接受的非露骨日常足部照片，没有答应公开账号以外的身份和额外要求。','对方先支付这次费用，你按约交付；后续不是这一次的附带义务。'],[C('按已约定的这一次交付','foot_paid'),C('这一次不接，仍更新原本日常','ordinary_paid')],5);
  N('foot_paid',2023,'生活账号／订单',['这笔钱真的到账。后来私信要求变了，你没因为收过上一次，就接受一切新增要求。','几次合意订单扣完相关支出，留下1000。你把其中超出约定的一条关掉。'],[C('交好今天已答应的内容，关掉新增要求','end_cyber')],5,{enter:gain(1000,'已完成非露骨约定订单净报酬')});

  // A work window delivers one contextual contact, not a menu of every hotspot.
  gate('work_window',s=>{
    const t=world(s,'work_contact',12);
    if(t===0)return 'ordinary_paid';if(t===1)return 'poor_context';
    if(t===2)return 'coin_first';if(t===3)return 'stream_invite';
    if(t===4)return has(s,'selling')?'ecom_start':'training';
    if(t===5)return 'family_gate';if(t===6)return 'relationship_start';
    if(t===7)return 'exam_job';if(t===8)return 'car_check';
    if(t===9)return 'abroad_check';if(t===10)return 'foot_offer';
    return college(s)?'wealth_intro':'billiards';
  });
  N('ordinary_paid',2023,'工作与住处',['工资到账了。房租、吃饭和本月费用付过，余下不多，暂时不必再借。','你没有忽然换成一份没应聘过的行政工作。原来的交接明天仍要做。','下班把饭热好，吃到一半没有电话叫你去解决别人的事。'],[C('把这顿饭吃完，收好明天的工装','end_normal')],14,{enter:s=>period(s,2,3000,2500,`${jobRole(s)}稳定窗口`),narration:11});
  N('poor_context',2024,'工作／下班',['手机里的视频说，大女主要永远先爱自己。你看完，顺手收藏。','购物车仍有想买的东西。明早六点半要起，你把闹钟打开，工作衣服搭在椅子上。'],[C('把手机放下，设好明早的闹钟','end_poor')],null,{art:4,enter:s=>period(s,2,3000,2600,`${jobRole(s)}本期个人收支`)});
  N('hangzhou',2025,'中控岗位面试','S30',[C('发相关任务记录和能到岗的日期','hangzhou_result',learn(1)),C('问排班、工资结算日和住处，按日期面试','hangzhou_result'),C('续已经确认的本地班，先付下月费用','ordinary_paid')],12,{enter:s=>{if(s.cash>=400)money(s,-400,0,'核过岗位后的杭州面试路费及短住');},narration:3});
  gate('hangzhou_result',s=>s.learn>=1||has(s,'selling')||has(s,'streamer')?'hangzhou_work':'hangzhou_missed');
  N('hangzhou_missed',2025,'中控面试之后',['这次没录用。联系人指出商品价格和库存任务里漏的一处，没把买过车票当作会做中控。','原本地岗位确认还可以到班。'],[C('按原班回去，把这次任务记下来','ordinary_paid')],12);
  N('hangzhou_work',2025,'杭州／电商中控',['到岗后，主播说下一件，你先核后台价格、库存，再切链接。有人说价格不对，你截图给负责的人，不随手换商品。','凌晨交接完，走出公司。明早醒来不用问家里要生活费。你很久没有在这个时候好好睡过。'],[C('把交接表发好，按班期回住处','end_binjiang')],12,{enter:s=>{setJob('电商中控','hangzhou')(s);period(s,6,5200,3800,'中控实际工作个人收支');}});

  N('coin_first',2024,'工作／同事的截图',['2024年，同事又发来比特币价格和到账截图。2021年的国内政策已明确相关交易业务属于非法金融活动，截图没有改变这件事。','比特币的规则限制总供给；价格却仍取决于有人愿意用多少买。有限不等于一定有人继续接。','同事只展示赚过的几笔。你查到另外的资料，也仍记着他那句：才投这么一点。你想先看看一小笔真正结算会怎样。'],[C('只用这次能动用的100，核这笔的实际结算','coin_profit',pay(100,'币市虚构情境首次自有本金'),cash(100)),C('把资料留着，照原班去工作','ordinary_paid')],5,{narration:3});
  N('coin_profit',2024,'一小笔真实结算',['这次卖出，扣完费用回到生活账户145。投入100，留下45。','你不是只看截图，真的多了一点钱。以后再遇到窘迫，好像终于有一种不必再求人的办法。','同事新发的仓位不是现货，是保证金合约。名义仓位更大，波动也更快消耗保证金；不足时会按规则被处理。'],[C('把已结算的钱留在生活账户，付拖着的房租','coin_withdraw'),C('只买能动用的自有现货，按原计划持有','coin_spot',pay(100,'现货自有本金'),cash(100)),C('把合约条款问完整，再核可投入的钱','coin_terms')],5,{enter:gain(145,'首次卖出扣费后的实到账（已付本金100）')});
  N('coin_terms',2024,'工作／合约说明',['你看过保证金、费用和自动平仓的规则。现货和合约不是同一笔产品，借钱与自有本金也不是同一种负担。','同事把上涨后的估算给你看。你想到的是，若到了那个数，就不用再一月月攒。价格怎样走，他不能保证。','你把这次能动用的300单列，生活费另留。'],[C('按已读的条款投入这300自有资金','coin_position',all(pay(300,'虚构合约自有保证金'),flag('coin_margin',300)),cash(600)),C('核过300借款约定，投入这一笔而留住生活费','coin_position',s=>{money(s,0,300,'另借300直接作保证金，不计可用现金');s.flags.coin_margin=300;s.flags.coin_borrowed=true;}),C('留住已经结算的钱，先付房租','coin_withdraw')],5);
  gate('coin_position',s=>world(s,'contract_price_path',3)===0?'coin_closed':'coin_liquidation');
  N('coin_closed',2024,'合约已结算',['价格到了先前设定的位置，仓位按那份计划结束，扣费后回款345。','本次有收益，不证明下次也有。那笔借款若存在，仍是账上另外一件事。'],[C('把实到账转回生活账户','coin_withdraw')],5,{enter:s=>{money(s,345,0,'虚构合约按计划结算回款');if(s.flags.coin_borrowed)money(s,-300,-300,'本次结算后归还借款本金');}});
  N('coin_liquidation',2024,'合约强制平仓',['价格往相反方向走。你几次想再等，页面里的保证金却已经到了这份规则的处理条件。','通知写着已执行强制平仓。仓位没有了，这笔投入也没有回到生活账户。','现货下跌不会因此被写成强平；消失的是你这次开的合约仓位。'],[C('查看处理通知，核自己另有的借款','end_liquidated')],5);
  N('coin_spot',2025,'现货结算',['这一段价格下跌。你卖出后扣费回到70，原投入100。','没有保证金仓位，也没有强制平仓通知。生活仍得用自己的工作接着安排。'],[C('把70记清，照原岗位去上班','ordinary_paid')],5,{enter:gain(70,'现货卖出扣费回款（原本金100）')});
  N('coin_withdraw',2024,'生活账户',['已经结算的钱在生活账户。你把拖着的这一笔房租付掉。','第二天价格又涨了。你看了几眼，关掉页面去上班。'],[C('收好房租记录，按今天的班出门','end_withdraw')],5,{enter:s=>money(s,-Math.min(100,s.cash),0,'拖欠房租的一部分实际支付')});

  N('stream_invite',2024,'开播的实际邀请',['你把几篇生活帖发给过同事，去看过一次真实开播。联系人问能不能先试几场。','这里做聊天和内容互动，不是电商讲品。分成比例、工时和结算日写出来以后，礼物流水才有实得的算法。','租用设备能先试，网费和时间要自己留。'],[C('按确认的几场和分成试播，留结算记录','stream_start'),C('先发已有作品，问中控岗位实际任务','hangzhou'),C('原来的班已排好，先完成这月工作','ordinary_paid')],null,{art:29});
  N('stream_start',2024,'试播','S33',[C('把下周内容和时间发给合作方','stream_progress'),C('问已完成场次的钱何时结，再核下周安排','stream_progress'),C('完成已约的场次，先不接新排班','stream_leave')],null,{art:29,enter:s=>{s.flags.streamer=true;gain(280,'试播报酬扣设备及约定费用后的实得')(s);}});
  gate('stream_progress',s=>['stream_work','stream_date','train_start','stream_savings'][world(s,'stream_career',4)]);
  N('stream_work',2026,'主播',['你准备内容、互动和复盘，冷场仍会发生。有人记得上次说过的话，下一句终于能接。','十二个月到账报酬102000，设备、相关结算成本及个人生活付过82800，留下19200。不是所有礼物都归你。'],[C('把下次提纲做好，按约开播','end_stream'),C('新人发录像来，问你冷场怎么熬','train_start'),C('核已约场次，申请结算不再接新表','stream_leave')],null,{art:29,enter:s=>{setJob('主播','stream')(s);period(s,12,8500,6900,'直播个人实得与全部支出');}});
  N('stream_leave',2026,'直播／结算',['余下的场次完成，欠款与合同逐条核过。你确认下一份班和住处，没有等亏光才关灯。','最后一场结束，设备收好。今晚不用再对着镜头找话。'],[C('核完结款，把灯关掉','end_laststream'),C('拿真实内容和任务记录去问中控岗位','hangzhou',learn(1))],null,{art:31});
  N('stream_date',2027,'主播／镜头外关系',['常来的观众约过你线下见面。几次相处，他见过你下播后不想再说话，也陪你处理过一次病中无人陪同的事。','礼物之外，你慢慢知道他在哪工作、怎么过日子。谈同住时，你先把还想保留的开播安排告诉他。'],[C('约时间把房租与分工谈清，再办共同生活手续','stream_home'),C('保留各自住处，按原场次播','stream_work')],null,{art:30,enter:s=>period(s,12,8000,6500,'镜头外交往期间自己的直播收支')});
  N('stream_home',2028,'主播／共同生活',['你们按说好的分工共同生活，婚事也确实办了。他没要求立刻关掉账号。','下播以后去买菜，忙时谁做饭已经商量好。你觉得这样的日子很好，并不知道往后一切。'],[C('带上已经列好的菜单，和他去买菜','end_streamwife')],null,{art:30});
  N('stream_savings',2031,'主播／多年积累',['这是少见的高收入个案。几年的场次、合同和结算确实做过，净储蓄不是礼物榜上的总数。','36个月到账2088000，各项工作与个人生活支出864000，留下1224000。债务仍另记，不会因收入高自动清零。','你按实际余钱安排住处，开播可以减少。婚姻不在今天的计划里。'],[C('按自己的预算落实住处，完成剩余场次','single_settle'),C('机构问是否愿意带新人，拿实际经历去谈','train_start')],null,{art:32,enter:s=>period(s,36,58000,24000,'稀有直播个案三年实得及支出')});
  N('single_settle',2031,'自己的储蓄与住处',['剩余场次交付，住处按自己列过的预算落实。账号不再需要每天开灯。','你把仍有的借款按约清偿，留下的才是净存款。今天先安排自己的日子。'],[C('收好已结账单，按自己的生活表安排','end_single')],null,{art:32,enter:s=>{const d=Math.min(s.debt,s.cash);money(s,-d,-d,'减少场次前归还可偿付借款');}});
  N('train_start',2028,'直播／带新人','S34',[C('接已约的几次辅导，写清交付内容','train_done',flag('training_mode','private')),C('拿辅导记录申请机构的带新人岗位','train_done',flag('training_mode','employee')),C('先问学员需要什么，只谈能交付的小班','train_class')],null,{art:34});
  N('train_class',2028,'小班准备',['你会带播，不等于会招生。几位真实学员说想练提纲和冷场，不是买一个保证爆红的名额。','课表、费用、退费和交付写清，预收不能全部当利润。你先把答应的录像复盘做完。'],[C('按写好的小班课表完成这一轮','train_done',flag('training_mode','class')),C('不招新班，交完已约的辅导','train_done',flag('training_mode','private'))],null,{art:34});
  N('train_done',2029,'幕后培训',['第一批辅导实际做完。课程费扣完已结退款与支出，实得2100。受雇这一路则按已完成课时结算同笔个案报酬。','新人卡了一下，自己把话接上。你坐在灯旁，没有立刻替她说。'],[C('把这次复盘交好，收起辅导记录','end_trainer')],null,{art:34,enter:gain(2100,'已交付培训扣费用退款后的实得（虚构个案）')});

  N('ecom_start',2025,'已有订单／小批卖货','S35',[C('按确认的订单补小批货','ecom_small',pay(600,'电商小批备货'),cash(600)),C('拿明确借款方案补这批，按约扩大投放','ecom_expand'),C('发完已有订单，这次不补新货','ecom_clear')],6,{enter:flag('selling')});
  N('ecom_small',2025,'小批交付',['这批订单做完，退货按实际单据处理。扣掉运费、平台费用和退款后收回950，先前付过采购600。','留下350，不是后台每一笔金额都能拿走。上家又发来更便宜的大批报价。'],[C('先交现有订单，不补下一箱','ecom_clear'),C('拿这次实际记录核融资采购单','ecom_expand'),C('只保留这批收益，按原班工作','ordinary_paid')],6,{enter:gain(950,'小批电商扣售后及费用后回款，采购另列')});
  N('ecom_expand',2026,'采购与投放',['采购单、投放和账期列出来了。这批要实际借40000，借款直接付货和相关投入，不会全出现在生活余额。','上家给了多拿货的折价，你见过上一批盈利，后台的图也在涨。你以为已经找到一种能重复的方法。'],[C('按核过的借款约定执行这次采购与投放','ecom_result',s=>money(s,0,40000,'本批借款直付经营投入')),C('按小批已确认的量交完，不签扩大合同','ecom_clear')],6);
  gate('ecom_result',s=>world(s,'ecom_returns',3)===0?'ecom_profit':'ecom_report');
  N('ecom_profit',2027,'这批经营结算',['采购、投流、平台结算费用、物流和退款都核过，净回款47000，原40000借款也付清了。','留下7000，是这批做成的结果，不是下一批也会成功的证明。'],[C('发完最后这箱，按已列的账结束补货','ecom_clear')],6,{enter:s=>{money(s,47000,0,'扩大经营本批全部成本结算后的实际回款');money(s,-40000,-40000,'归还本批经营借款');}});
  N('ecom_report',2027,'退款与借款',['退回来的包裹堆在门口，有些不能按原价卖。剩余库存未卖出不能写成现金。','目前净回款只有28000，还了这一部分，仍欠12000。后台营业额看着热闹，不能替你付账。','有人问下一批什么时候进，你先把实际退货和未还的数摊开。'],[C('核退货和未还日期，给供货人回实际情况','end_ecomdebt')],6,{enter:s=>{money(s,28000,0,'扩大经营到期前净回款');money(s,-28000,-28000,'回款归还本批借款，仍欠12000');}});
  N('ecom_clear',2027,'最后一批货',['最后一箱按真实订单发走，待收的钱另记，没有按发货日期就提前加进余额。','后来这一轮结款完成，剩余供货和售后也结清。今天没有继续买下一批。'],[C('收好本轮结算，合上补货清单','end_lastbox')],6,{enter:gain(180,'既有最后一箱在实际结算后的净收益')});
  N('training',2026,'求职面试','S36',[C('让他发课程、推荐岗位与分期合同','training_terms'),C('按这份课程合同办理分期','training_done',s=>money(s,0,19800,'培训款直接付机构的真实分期')),C('给另一个招聘联系人发自己的作品','ordinary_paid')],12);
  N('training_terms',2026,'培训合同',['课程表里有剪辑与账号实操，作品确实能上课做。推荐岗位不等于录用，广告工资也不是每个人入职后的薪水。','分期付款给机构，不是向你发一笔自由花的钱。你又算了一次，如果得到广告里那份薪水，多久能还。'],[C('按合同报名，保留推荐条款','training_done',s=>money(s,0,19800,'课程分期直付机构')),C('把合同给可信的人看，续原班再投简历','ordinary_paid')],12);
  N('training_done',2027,'课程结束',['你确实学会一些剪辑和运营。推荐岗要自己面试，报酬口径也和宣传不同。','课上作品能拿出去投，录用却不是课程结束的附赠品。还款日没跟着推迟。'],[C('把真正做过的任务发给对应招聘','training_job_result',learn(2)),C('先续原来的班，按借款日期安排生活','consumption')],12);
  gate('training_job_result',s=>world(s,'training_job',3)===0?'hangzhou':'consumption');
  N('consumption',2027,'工作／广告与消费',['你回看一次上镜录像。有人让你换灯，也有人发来医美分期咨询。','广告只说调整，没说具体项目和谁实施。付款对象、医疗资格、费用与借款合同也不在同一张图里。','你也刷到冻卵广告：“给未来留选择”。停了一会儿，先开了专业咨询页。'],[C('问咨询方具体项目、资质和费用，不先签款','beauty_consult'),C('保存冻卵咨询页，记下要问的条件','freeze_ad'),C('先去今天已排的班，处理现有账单','ordinary_paid')],5);
  N('beauty_consult',2027,'医美／分期咨询',['你询问了实施机构、具体项目和费用组成。对方还没给出能核清的完整回答，分期申请却已经发来。','你没有把一张咨询广告当成可实施的医疗方案，也没有因为不签这一笔就失去已做的直播和工作。'],[C('把咨询记录收好，先处理原来的工作与借款','ordinary_paid')],5);
  N('freeze_ad',2027,'冻卵信息',['咨询页需要先核地区、医疗条件和资格。广告没有替你完成任何一项评估，也不是医疗许可。','你记下还没问明白的事，本周的班表仍在手机里。'],[C('收好咨询记录，按这周班表工作','ordinary_paid')],8);

  N('exam_job',2026,'实际岗位／报名',['同事转来一份公开招聘简章。你核了学历、专业、年龄与其他条件，当前确实能报。','地方离家近，收入没有广告夸张。考试和录用仍要按这份简章走，不因点报名就有岗位。','边工作复习保住收入；暂停工作能多准备，也会留下空档。'],[C('按排班下班复习，报名参加这一轮','exam_result',flag('exam_fulltime',false)),C('和供吃住的家人谈半年安排，暂停工作备考','exam_result',flag('exam_fulltime')),C('先接眼前的班，这次不报名','ordinary_paid')],null,{art:25});
  gate('exam_result',s=>world(s,'exam_first',4)+Math.min(s.study,2)>=3?'exam_hired':has(s,'exam_fulltime')?'exam_failed_full':'exam_failed_work');
  N('exam_hired',2027,'招聘程序完成',['这一轮笔试、面试和简章要求的后续程序都完成了。报到通知有你的名字。','你给原岗位办了交接，不是打开报名页就拿到了工作。'],[C('按通知收好报到材料，下周去单位','end_exam')],null,{art:42,enter:setJob('公开招聘录用岗位','exam')});
  N('exam_failed_work',2027,'工作／考试之后',['这次没录用。原岗位还在，你没有因为一次失败就突然空掉几年简历。','你把成绩与简章收好，明天仍按班去。'],[C('按原班工作，再安排下一次准备','ordinary_paid')],null,{art:25});
  N('exam_failed_full',2027,'全职备考之后',['这次没录用。你觉得还差一点，家里供住处，但原岗位已经补了人。','下一轮仍要核真实报名条件。再用一年准备，还是重新找工作，时间不会同时够两份。'],[C('按家里商量的吃住安排，再准备下一轮','exam_years'),C('停止这次全职安排，给原招聘联系人回信','service_offer')],null,{art:25});
  N('exam_years',2029,'全职备考／几年过去',['第二次又没录用。你重排资料，再准备一轮；家里一直留着住处。','简历的空白已经几年。家人问下次什么时候报名，原单位早换过几批人。'],[C('按仍可报的简章参加这一轮','exam_late_result'),C('拿确实有空档的简历去问实际工作','ordinary_paid')],null,{art:25});
  gate('exam_late_result',s=>world(s,'exam_late',4)===0?'exam_hired':'exam_last_failed');
  N('exam_last_failed',2030,'全职备考／家里',['这轮仍没录用。下一次日期又记下，家里继续给你留房间。','你帮着做家务，也知道这些年自己的履历已经和最初不一样。'],[C('收好这一轮结果，整理下一次资料','end_daughter')],null,{art:25});

  N('car_check',2027,'工作／驾驶合同','S37',[C('把首付月供算进账，继续核购车合同','car_owned_terms'),C('拿平台配车合同，问租金外另收什么','car_rent_terms'),C('问未出车的天数，仍按原来的班工作','ordinary_paid')],13,{enter:flag('driving_background')});
  N('car_owned_terms',2027,'自购车／条件与合同',['你已有驾驶经历，按当地当年规定核过个人、车辆与运营条件，不能拿普通驾驶许可当一切已经齐全。','本虚构报价：首付10000，贷款60000，每月按合同2200还36期。保险保养、充电、平台结算项和生活另记，不套统一税率。','贷款直付购车款，车是资产不是生活现金。你算了订单少和停驶时要留多少。'],[C('按核过的合同付首付，办理这辆车','car_owned',all(pay(10000,'自购运营车辆虚构首付'),s=>money(s,0,60000,'购车贷款直付车款'),flag('car_owned'),s=>{s.flags.car_start_year=s.year;s.flags.car_start_month=1;}),cash(10000)),C('钱暂不够，先按原班攒首付','car_save'),C('再看无需首付但按月租的方案','car_rent_terms'),C('继续原来的工作，这次不签车辆合同','ordinary_paid')],13);
  N('car_save',yearPlus(1),'工作／首付准备',['你多做了一年已确认的班，不是填申请就有人替你补首付。收入45600，生活33600，留下12000。','这段时间，别人仍替你排班。那份能自己定出车时间的合同，你又拿出来算了一遍。'],[C('按实际有的钱核购车首付与还款','car_owned_terms'),C('先保留储蓄，按原班工作','ordinary_paid')],13,{enter:s=>period(s,12,3800,2800,'筹购车首付期间原岗位收支')});
  N('car_owned',s=>(s.flags.car_start_year||2027)+1,'自购网约车',['最初有些日子确实能多跑，也能自己决定几点回。','你按合同核司机实到账，逐月付充电、保险保养等支出与生活，再付月供。','从交车那年一月算起，十八期走到了次年六月。有一段订单变少，后来车也要处理故障。'],[C('核完第十八期，把车送检并安排本周出车','car_balance')],13,{enter:s=>{setJob('自购车网约车司机','driving')(s);period(s,18,7400,4500,'前十八期司机结算后收入及运营生活支出');money(s,-39600,-30000,'十八期月供39600：本金30000、合同融资费用9600（虚构拆分）');}});
  gate('car_balance',s=>world(s,'car_income_path',3)===0?'car_sustainable':'car_nineteen');
  N('car_sustainable',s=>(s.flags.car_start_year||2027)+1,'网约车／第十九期',['过去留出了应急的钱，今天修车仍能承担。扣完固定支出，工作暂时能够继续。','你按这份合同和实际收入过日子，没有被换成另一个职业。'],[C('按真实出车和还款日期安排下个月','ordinary_paid')],13);
  N('car_nineteen',s=>(s.flags.car_start_year||2027)+1,'网约车／第十九期',['这段时间订单少，维修和家里额外支出又赶在一起。前面留下的钱大半付了，今天没有出车。','第十九期扣款短信照常到了。贷款没有因停驶就停止。','现在能确认的是今天的缺口，不是申请那天看见的整月流水。'],[C('把本期到期金额和余款记清，联系合同方','end_car')],13,{enter:s=>{const use=Math.max(0,s.cash-800);money(s,-use,0,'订单变少期间实际维修、生活及额外家庭支出（虚构个案）');}});
  N('car_rent_terms',2027,'租车／另一份合同',['这份方案没有给你购车贷款，车辆也不是你的资产。合同列押金2000、月租和服务费，保险包含哪项另核。','按本个案司机实际结算收6400，固定费用与充电、生活合计5900。多跑能多留，没出车也仍有租金。','退车要核押金、未结订单和已约扣项，不是放下钥匙就清账。'],[C('按核过的租车合同交押金，试这段班','car_rented',all(pay(2000,'租车可退押金（暂不计可用现金）'),flag('car_rented')),cash(2000)),C('先按原班攒钱，不签这份租约','ordinary_paid')],13);
  N('car_rented',2028,'租车司机',['你按这份合同跑了一段时间。有人不再给你排早晚班，每月固定费用却照来。','按实际结算做了三个月。接下来的订单变少，你拿合同问退车需要完成哪些手续。'],[C('核最后订单与扣项，按合同退车','car_rent_end'),C('仍按已算过的净收入继续出车','ordinary_paid')],13,{enter:s=>{setJob('租车网约车司机','driving')(s);period(s,3,6400,5900,'租车驾驶个案司机实到账及全部支出');}});
  N('car_rent_end',2028,'租车／退车结算',['车验过，最后订单结了，合同约定的已核扣项付过。原2000押金扣实据300，1700真正退回。','你没有购车余贷，也不能拿一份租车合同走到车贷第十九期。原来问过的岗位有了到班日期。'],[C('收好退车结算，按已确认的岗位去试班','ordinary_paid')],13,{enter:gain(1700,'租车押金扣300有据费用后实际退回')});

  gate('family_gate',s=>world(s,'family_request',4)===0?(s.year<=2026?'brother_computer':'brother_house'):world(s,'family_request',4)===1?'brother_house':world(s,'family_request',4)===2?'childcare':'parents');
  N('brother_computer',2023,'家里／弟弟课程',['弟弟2005年出生，这年十八岁。课程确实要电脑，他发来老师的要求和配置。','母亲问你先出多少。你自己的电脑也慢，房租提醒在手机里。','他接着发：买了就好好学。这次需要是真的，不代表家里所有钱都该从你这里来。'],[C('出能动用的1000，让大家分担余款','family_thanks',pay(1000,'弟弟课程电脑实际分担'),cash(1000)),C('发自己的费用日期，重新商量数额','family_after'),C('问老师有没有便宜一档的配置','family_after')],12,{narration:10});
  N('family_thanks',2023,'家里／电脑到了',['弟弟发了几条语音，真的很高兴。你也高兴，又舍不得刚转出去的钱。','两种感觉没有互相抵掉。他后来把你要的材料跑了一趟，拍过来，也没有因此许诺今后所有问题都由他负责。'],[C('谢过他，拿好明天仍要用的材料','family_after')],12);
  N('brother_house',2028,'家里／买房讨论',['弟弟二十三岁。家里讨论婚事，买房首付还差20000；不是彩礼的钱混在这里。','母亲问四个孩子各能给多少。你算了房租和自己的未还借款，转得出去的不等于适合全转。'],[C('只出已商定的1000，余款请大家谈','brother_money',pay(1000,'弟弟买房首付部分分担'),cash(1000)),C('发自己的账，先不承担首付','brother_money'),C('按已商量的5000出资，另留生活费','brother_money',pay(5000,'弟弟购房实际份额'),cash(6500))],15,{narration:10});
  N('brother_money',2029,'家里／婚事',['房款另有安排。现在提的是婚礼和彩礼这笔缺口，虚构个案为60000。','母亲已经问过两个姐姐；她们能筹的份额不同。弟弟发来日期，问你先前说的那一部分怎么办。','你拿自己的现金和借款并排算，不把别人的缺口当作自己一定要付的金额。'],[C('转已商量的3000，保留基本生活钱','wedding',pay(3000,'婚礼及彩礼缺口个人出资'),cash(4500)),C('按实际60000借款方案筹已承诺的缺口','wedding',s=>money(s,0,60000,'婚礼借款直接支付家庭缺口（虚构合同）')),C('发自己的账，重新谈出资，仍去婚礼','wedding')],15);
  N('wedding',2029,'弟弟婚礼',['婚礼真的办了。喜糖在袋子里。弟弟感谢你特地回来，亲戚也问你什么时候结婚。','你看自己的余额和真实借款日期，婚礼的热闹没有替这张账自动减数。'],[C('把喜糖收好，核自己回去的车票','end_wedding')],15);
  N('childcare',2030,'家里／临时带孩子',['弟弟已结婚有孩子。弟媳再不回去，岗位留不住。托育没排上，母亲身体也不适合全天带。','弟弟说先帮半年，之后一定接回。你觉得事情过去，原工作还能接着做。','雇主能留多久的岗位，要先问。半年后的安排，现在还只是一句承诺。'],[C('和雇主确认请假条件，再约半年交接','care_start',flag('caregiver')),C('发能帮的日期，请他们落实其余时间','family_after')],null,{art:2});
  N('care_start',2030,'照护孩子',['单位能留的时间不到半年。你仍按家里谈过的安排先接了孩子，想着再协调。','半年到了，托育和接送没有落实。弟弟解释新困难，弟媳仍要上班；你也问过几次何时交接。'],[C('把原定日期和岗位回复发过去，问接下来谁接','care_result')],null,{art:2});
  gate('care_result',s=>world(s,'care_replacement',3)===0?'care_replaced':'care_extended');
  N('care_replaced',2031,'照护交接',['姐姐协调出轮换，托育也落实了。你把时间表交给他们，开始重新联系工作。','原岗并没有一直等，但你可以带着这段空档去找下一份。'],[C('发简历，按实际到岗日回去工作','ordinary_paid',flag('caregiver',false))],null,{art:2});
  N('care_extended',2033,'长期照护',['半年又半年。你几次提过交接，也拿过原单位不再保留岗位的回复，新的安排仍一次次延期。','等孩子入园，原单位换了几批人。你翻出那条最初的消息：先帮半年。'],[C('给孩子收好入园物品，整理自己的旧简历','end_halfyear')],null,{art:2});
  N('parents',2032,'家里／父母照护',['父亲就诊，母亲也不像以前能一直劳动。检查、交通和费用发进家庭群。','四个孩子的工作、钱和能到的时间不同。你把自己这一周的班发出来，不凭一句养老就自动承担往后的一切。'],[C('把实际费用和时间发群里，谈轮换','family_after',flag('shared_care')),C('先处理本周检查，分担已核的500','family_after',pay(500,'父母本周检查及交通份额'),cash(500))],8,{narration:10});
  N('family_after',2018,'自己的工作与生活',['这一次请求处理了。前面真实给过的钱仍在账里，没有因为回自己的生活就自动拿回来。','你的原岗位、课程和作品各有自己的前史。家里没有立刻又把所有未发生的请求发来。'],[C('按此前岗位做完这月，先交自己的费用','ordinary_paid'),C('有时间和大学作品，把未做完的页面打开','creator_prepare',{},creative)],10);

  N('relationship_start',2026,'已经相处的人',['你们在现在工作的店认识，见过彼此赶班和缺钱的日子。','他接过你晚班后的饭，你也替他处理过忙不过来的事。谈同住时，先说房租、早晚班和谁做饭。','钱没有突然变多，但有些事情可以一起承担。'],[C('把两个人班次与开销记一起，按分工同住','dinner',flag('married')),C('保留各自住处，按自己的班工作','ordinary_paid')],14);
  N('dinner',2027,'普通共同生活',['工资和费用记在同一本账，今天他做饭，明天你早下班。','你拍了桌上的饭，想发一句：今天下班不用自己做。并不知道哪张日常会被陌生人看到。'],[C('放下手机，和他把这顿饭吃完','end_home'),C('把照片和今天的分工写出来发帖','comments')],null,{art:6});
  N('comments',2027,'日常帖被转发',['帖子被转到更大的圈子。有人祝福，也有人问为什么做顿饭就值得夸。','评论把你没说过的观点也安到你身上。你说的是今天的晚班和这顿饭，有人谈的却是所有女人该怎样。','厨房里，他问明天吃什么。手机还在亮。'],[C('回复真实分工，不替别人编想法','end_wife'),C('关评论，把手机放回桌上','end_wife'),C('删去不想公开的照片，保留自己的说法','end_wife')],5);
  N('wealth_intro',2026,'毕业后的旧联系',['大学活动里，你们同组做过材料。他家里条件很好，但那次没有替你完成任务，只在缺材料时很快找到了人。','毕业后仍联系，见过几次面，关系才开始。你讲过新住处的押金问题，他问具体差多少。','这笔钱对他轻，对你是几个月积蓄。不是因为你朴实，就由学校分配一个救你的人。'],[C('接受这次具体帮助，仍按自己的班工作','wealth_life',flag('wealth_help')),C('先按已有的钱安排，继续约下次见面','wealth_life'),C('谢过他，按自己的工作处理这次住处','ordinary_paid')],null,{art:35});
  N('wealth_life',2026,'关系与自己的工作',['住处这件事有了具体安排。你把自己的开销和工作也讲给他听，没有用他的收入替掉自己的工牌。','他送你到公司。车停下，你拿出工牌。接受的那次帮助可以是真的，往后的关系仍没有一张保证书。'],[C('拿好自己的工牌，下车去今天的班','end_passenger')],10);

  // Japan care-work is one explicit fictional destination, using a dated policy snapshot.
  N('abroad_check',2026,'出国信息／日本照护工作',['以前一起做过班的人发来日本早班的照片。你问每天做多久、房租多少，她先给你看这个月的开销。','你查的是照护工作的特定技能路径，不把旅游签证当工作许可。语言、技能、雇佣条件和申请不是一回事。','按2026年公开资料准备；未来申请仍要核届时规则。你不先签一句包办就能把这些省掉的合同。'],[C('按正式渠道列语言与技能准备，问岗位条件','abroad_prepare'),C('先留已有工作，攒能承担的准备费用','ordinary_paid')],8);
  N('abroad_prepare',2027,'语言、技能与合同',['你用了这一年，边做班边学。不是买课程就自动得到考试成绩。','这段虚构经历里，你后来拿到了岗位要求的语言与照护技能证明，并收到真实雇佣条件。','工资、住处、工时、支持和允许工作的范围分别问清。这里没有把旅游入境写成能直接上班。'],[C('核姓名和证明，把雇佣材料交正式申请渠道','abroad_apply'),C('先保留证明与合同，继续本地工作','ordinary_paid')],8,{enter:s=>period(s,12,3800,3200,'出国准备期间工资及生活学习支出')});
  N('abroad_apply',2027,'申请材料',['你和接收方核申请材料：实际雇佣条件、考试证明、身份资料及这次所需文件。','在留资格材料与其后的签证、入境安排要分别办理。对方不能用一张录用邮件替掉全部手续。','通知来了，你先核发件来源，再打开附件。'],[C('查看已经收到的正式回复','abroad_result')],8);
  gate('abroad_result',s=>world(s,'visa_documents',3)===0?'abroad_returned':'abroad_approved');
  N('abroad_returned',2027,'材料补正通知',['这份回复要求补正。附上的雇佣条件文件里有一处与申请填写不一致，接收方要重新确认。','这不是已经获准，也不是材料退回就宣布永远不能出发。下一轮要继续准备时间与费用。'],[C('圈出要求补的那项，给接收方核文件','end_returned')],8);
  N('abroad_approved',2028,'手续获准／出发准备',['接收方补齐条件，这段虚构申请获得了实际许可；后续签证和入境手续也分别完成。','你付了已经核过的机票与初到生活费用。住处和第一段班由合同中的接收方对上，不是下飞机便无条件随便找工作。'],[C('按已确认的住处报到，去做第一段交接','abroad_arrive')],8,{enter:s=>money(s,-Math.min(3500,s.cash),0,'核过安排后的机票及初到费用（虚构个案）')});
  N('abroad_arrive',2028,'日本／照护工作早班',['培训和工作交接按安排做过。住处不宽，语言还会卡，工资也要先减当地生活支出。','没有暴富。闹钟响，今天按这边的时间去做早班，家里的消息还没回。'],[C('收好自己的钥匙，按早班时间出门','end_abroad')],null,{art:37,enter:setJob('日本照护工作','abroad')});

  N('creator_prepare',2026,'二十三岁／工作与项目',['你在大学持续写过生活，也学着查问题。电脑不是这一页送的，之前确实试过、攒钱买过。','白天的工作还在。晚上打开第一个页面，有存档两个字，点了，刷新，进度仍没了。','你发现，写一个按钮和真的保存数据，是两件事。'],[C('记刷新前后的情况，只改这一处','ai_debug'),C('保留这版和报错，明天下班再做','ai_rest')],12,{narration:12});
  N('ai_rest',2026,'工作／项目还在',['你睡了。第二天去做已排的班，房租和消息没有因此消失。','晚上打开保留的版本，报错仍是那一条。休息没有把继续做的资格永久删掉。'],[C('复现一次，把报错和预期分开写','ai_debug')],12);
  N('ai_debug',2026,'修一个具体问题',['保存动作原来没接到持久存储。你把它接上，连续刷新几次，数据还在。','发给朋友，他打不开你复制的localhost地址。你去查，那是自己的机器入口，不是别人也能访问的网站。'],[C('把小版本部署到可访问地址，让朋友试手机','ai_publish'),C('先留修改记录，明天下班接着做','ai_rest')],12,{enter:learn(1)});
  N('ai_publish',2026,'作品与反馈',['朋友在手机上指出一行字挡住了按钮，你又改了一版。','有人说看不懂，有人说没用，也有人私信：“我以前没这么想过。”','这不是证明你创业成功。电脑上还有没改完的地方，明天仍要工作。'],[C('记下这次反馈，留好明天要改的那一处','end_unfinished')],12);

  // Quotes are original, once-per-run. Re-entering does not replay a payment or reroll a fact.
  for(const n of Object.values(nodes)){
    if(n.narration){const f=n.enter;n.enter=s=>{if(f)f(s);const used=s.flags.narrations||(s.flags.narrations={});if(!used[n.narration]&&(n.narration!==3||s.year>=2021&&s.year<=2026))used[n.narration]=n.id;};n.quote=s=>s.flags.narrations?.[n.narration]===n.id?T.narrations[n.narration]:null;}
    if(!n.ending){const baseRole=n.role;n.roleFor=s=>['ordinary_paid','poor_context','work_window','family_after'].includes(n.id)?jobRole(s):baseRole;}
  }
  const migratedIds=[...new Set([...old.legacyNodeIds,...Object.keys(old.nodes)])];
  const migration={school:'school_event',school_pool:'school_event',job_entry:'service_offer',job_branch:'work_window',front_later:'front_repeat',admin_later:'ordinary_paid',ordinary_life:'ordinary_paid',wind_entry:'work_window',wind_again:'work_window',family_child:'dinner',wealth_date:'wealth_intro',car_sell:'ordinary_paid',coin_margin:'coin_terms',foot_offer:'foot_offer',beauty:'beauty_consult',beauty_later:'ordinary_paid',ai_first:'creator_prepare',voc_teacher:'voc',voc_choice:'voc_life',high_result:'gaokao',college_gate:'college_start',later_direction:'work_window',college_end:'graduate_window',ordinary_next:'ordinary_paid'};
  function restore(x){
    const originalEdition=x.edition;x.flags=x.flags||{};x.ledger=Array.isArray(x.ledger)?x.ledger:[];x.checkpoints=Array.isArray(x.checkpoints)?x.checkpoints:[];x.flags.world_seed=x.flags.world_seed||1;
    if(originalEdition!==4){x.flags.narrations={};if(x.history.some(id=>['sister_stay','sister_child','sister_care','front_entry','front_paid'].includes(id))){x.flags.sister_stay=true;x.flags.left_school=true;x.flags.college=false;x.flags.private=false;x.flags.university=false;}
      if(college(x)){x.flags.degree=x.flags.private?'private':x.flags.university?'public':'college';x.flags.grad_year=x.flags.grad_year||Math.max(x.year,x.flags.degree==='college'?2024:2025);x.flags.college_start_year=x.flags.college_start_year||Math.max(2021,x.flags.grad_year-(x.flags.degree==='college'?3:4));x.flags.remaining_tuition_booked=true;}
      x.flags.job=x.flags.job||(x.role?.includes('厂')?'电子厂工人':x.role?.includes('前台')?'洗浴会所前台':x.role?.includes('主播')?'主播':x.role?.includes('运营')?'运营助理':'店员');
      if(migration[x.node])x.node=migration[x.node];
      if(!nodes[x.node])x.node=x.flags.caregiver?'care_extended':x.flags.sister_stay?'front_entry':college(x)?'graduate_window':'service_offer';
      // A v3 first-entry grant must not be replayed merely because its node changed name.
      x.history=[...new Set([...x.history,x.node])];
    }
    if(x.node==='creator_prepare'&&!creative(x))x.node='family_after';
    x.edition=4;return x;
  }
  function available(s){const n=nodes[s.node];return n.choices.filter(c=>!c.when||c.when(s));}
  function roleFor(s,n){return n.roleFor?n.roleFor(s):n.role||s.role;}
  // Development explanations do not belong in player prose.
  const trimLines={
    high_fee:[['能报的是另一所离家更远的普高，报名不是加钱买原来学校的名额。','能报的是另一所离家更远的普高。老师核过成绩和报名范围，把日期写给你。']],
    repeat_offer:[['这一年真的要过去。不是再点一次原来的成绩查询。','你在新的课表上写下日期，又要开始一整年的准备。']],
    voc_life:[['比赛、上课、喜欢一个人，会在同一段日子里发生。不是四条互相删掉的路。','老师催作品，搭档催训练，学长也等你一起吃饭。你翻课表，想把几件事都放进去。']],
    romance_months:[['这阵子身体变化，你去做了检查。结果不是答应看电影就决定了的。','这阵子身体变化，你去做了检查，结果还没取。']],
    graduate_offer:[['你把剩余学业办完，按约定交接。学历不是立刻变成行政岗的按钮。','你把剩余学业办完，按约定交接。简历上先写自己实际做过的任务。']],
    ordinary_paid:[['你没有忽然换成一份没应聘过的行政工作。原来的交接明天仍要做。','明天仍要做原来的交接。工装搭在椅背上。']],
    wealth_intro:[['这笔钱对他轻，对你是几个月积蓄。不是因为你朴实，就由学校分配一个救你的人。','这笔钱对他轻，对你是几个月积蓄。你答应见面，又把第二天的班告诉他。']],
    creator_prepare:[['你在大学持续写过生活，也学着查问题。电脑不是这一页送的，之前确实试过、攒钱买过。','你在大学持续写过生活，也学着查问题。桌上是之前试过、攒钱买下的旧电脑。']],
    ai_publish:[['这不是证明你创业成功。电脑上还有没改完的地方，明天仍要工作。','电脑上还有没改完的地方。你把明天的工作闹钟设好，又看了一眼反馈。']],
    car_rent_end:[['你没有购车余贷，也不能拿一份租车合同走到车贷第十九期。原来问过的岗位有了到班日期。','没有购车余贷。这段租约处理完，原来问过的岗位也给了到班日期。']],
    abroad_check:[['按2026年公开资料准备；未来申请仍要核届时规则。你不先签一句包办就能把这些省掉的合同。','你按查到的正式资料准备，申请时还要核最新要求。对方一句包办，你仍想先看看具体材料。']]
  };
  for(const [id,replacements] of Object.entries(trimLines))nodes[id].body=nodes[id].body.map(line=>replacements.reduce((out,[before,after])=>out===before?after:out,line));
  nodes.shoe_offer.body=['上家说鞋是渠道货，图片确实像你一直舍不得买的那双。你已有顾客问尺码，价差比原来卖的小东西大。','对方说来源没问题，却还没有发来可核的凭据。你把顾客的问题复制过去，等他回复。'];
  const teaEnter=nodes.tea_start.enter;nodes.tea_start.enter=s=>{teaEnter(s);s.flags.tea_experience=true;};
  // Remaining academic fees are settled once when that period is actually passed.
  for(const n of Object.values(nodes))if(!n.ending){const before=n.enter;n.enter=s=>{if(before)before(s);if(college(s)&&s.flags.college_start_year&&s.flags.grad_year&&s.year>=s.flags.grad_year&&!s.flags.remaining_tuition_booked){const years=s.flags.degree==='college'?3:4,amount=s.flags.private?12000:s.flags.degree==='college'?3000:4000;money(s,0,(years-1)*amount,`后续${years-1}学年虚构学费缺口，借款直付学校（此前第一学年另记）`);s.flags.remaining_tuition_booked=true;}};}
  nodes.brother_computer.body=s=>[`弟弟2005年出生，这年${s.year-2005}岁。课程确实要电脑，他发来老师的要求和配置。`,'母亲问你先出多少。你自己的设备也不快，房租提醒在手机里。','他接着发：买了就好好学。你看见那句，又把本月的费用纸打开。'];
  nodes.brother_house.body=s=>[`弟弟${s.year-2005}岁，家里正在讨论婚事。买房首付还差20000，与彩礼另算。`,'母亲问四个孩子各能给多少。你先把自己的房租和未还借款列出来。'];
  // Closing facts must describe this run, not imply the same outcome for every path.
  nodes.end_normal.body=s=>[`你继续做${jobRole(s)}。这个月的收入已经付过房租和饭钱，生活暂时不必再借钱周转。`,'没有突然发财，也没有换成另一种人生。今晚，你坐着吃完了一顿饭。'];
  nodes.end_young.body=s=>[college(s)?'你读过大学，找工作时仍进了电子厂，做实际安排给你的工位。':'你离开了学校，进电子厂做工，住进工厂宿舍。工资能付眼前的吃住，上学那条路却停了。',`你${s.year-2003}岁，是这一批工人里年纪最小的女孩。工牌挂在胸前，下班时学校那边还亮着灯。`];
  nodes.factory_offer.body=s=>[`宿舍看过了，工位与报酬也问了。你${s.year-2003}岁，单位核了年龄。`,college(s)?'你读过大学，这份招聘给的仍是车间工位。眼前先要解决工资和住处。':'你离开学校，开始按工厂的班上工。工资能付眼前吃住，学习时间却不再由你自己安排。','下班时，学校那边还亮着灯。你在这一批人里年纪最小。'];
  nodes.end_passenger.body=s=>['你和大学时认识、家境富裕的男生开始交往。',has(s,'wealth_help')?'你接受了他这次关于住处的帮助，仍保留自己的工作和收入。':'这次住处的钱按你自己的安排处理，你没有接受那笔经济帮助。他仍来送你上班。','生活里的经济差距没有因此消失。车停了，你拿出自己的工牌。'];
  nodes.end_trainer.body=s=>[has(s,'training_mode')&&s.flags.training_mode==='employee'?'你申请了机构带新人主播的岗位，完成了第一批辅导，按课时拿到2100元报酬。':s.flags.training_mode==='class'?'你办了第一期主播小班，教提纲、应对冷场，复盘学员录像。扣除实际费用和退款，留下2100元。':'你做了第一批新人主播的私人辅导，教提纲、应对冷场，复盘她们的录像。扣除费用后，实得2100元。','新人卡了一下，自己把话接上。你坐在灯旁，这次没有立刻替她说。'];
  nodes.end_car.body=s=>['你贷款买车跑网约车，已还十八期。订单变少，修车和家里额外开支花掉了大半余钱。',`第十九期${s.edition===4?'月供2200元':'按合同约定的月供'}仍要交。你现在能用的现金是${s.cash.toLocaleString('zh-CN')}元，未还借款另记在账上。`,'今天没有出车，扣款短信照常来了。'];
  const oldRestore=restore;
  function restoreSafe(x){x=oldRestore(x);if((x.node.startsWith('ai_')||x.node==='creator_prepare')&&!creative(x))x.node='family_after';return x;}
  window.STORY={nodes,endings,fresh,apply,has,college,creative,money,restore:restoreSafe,available,roleFor,artFor:id=>nodes[id]?.art??8,legacyNodeIds:migratedIds,edition:4,world};
})();
