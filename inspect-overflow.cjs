const { chromium } = require('@playwright/test');
(async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:3001/login',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>localStorage.setItem('fleet_partner_auth', JSON.stringify({isAuthenticated:true,hasFinishedOnboarding:true,user:{email:'test@example.com',role:'FleetOwner',name:'test'}})));
  for (const w of [320,1024]){
    await page.setViewportSize({width:w,height:900});
    await page.goto('http://127.0.0.1:3001/dashboard',{waitUntil:'domcontentloaded'});
    const out=await page.evaluate(()=>{
      const all=[...document.querySelectorAll('*')];
      const offenders=[];
      for (const el of all){
        const cs=getComputedStyle(el);
        if (cs.display==='inline') continue;
        const sw=el.scrollWidth, cw=el.clientWidth;
        if (sw-cw>1){
          offenders.push({tag:el.tagName.toLowerCase(), cls:el.className?.toString().slice(0,120)||'', id:el.id||'', diff:sw-cw, sw,cw, x:el.getBoundingClientRect().x, w:el.getBoundingClientRect().width, overflowX:cs.overflowX});
        }
      }
      offenders.sort((a,b)=>b.diff-a.diff);
      return {innerW:window.innerWidth, docW:document.documentElement.scrollWidth, bodyW:document.body.scrollWidth, top:offenders.slice(0,20)};
    });
    console.log('\nWIDTH',w,JSON.stringify(out,null,2));
  }
  await browser.close();
})();
