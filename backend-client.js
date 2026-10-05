(() => {
  async function load() {
    try {
      if(!document.querySelector('meta[name="game-backend"][content="enabled"]'))throw Error('静态版');
      const res=await fetch('/api/public/content',{cache:'no-store'});
      if(!res.ok || !res.headers.get('content-type')?.includes('application/json'))throw Error('后端不可用');
      const data=await res.json();
      if(!data || typeof data.overrides!=='object')throw Error('内容格式错误');
      for(const [id,change] of Object.entries(data.overrides)){
        const n=window.STORY.nodes[id];if(!n || !change || typeof change!=='object')continue;
        if(Array.isArray(change.body) && Array.isArray(n.body))n.body=change.body;
        if(typeof change.quote==='string' && typeof n.quote!=='function')n.quote=change.quote;
        if(typeof change.image==='string' && /^\/api\/public\/assets\/[a-f0-9]{64}\.(png|jpg|webp)$/.test(change.image))n.image=change.image;
      }
      window.GAME_BACKEND={enabled:true,contentVersion:data.version,buildId:data.buildId};
    } catch { window.GAME_BACKEND={enabled:false,contentVersion:0,buildId:'static'}; }
    const script=document.createElement('script');script.src='game.js';document.body.append(script);
  }
  load();
})();
