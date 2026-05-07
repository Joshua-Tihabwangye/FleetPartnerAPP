const { chromium } = require('@playwright/test');

(async()=>{
  const base=process.env.BASE_URL || 'http://127.0.0.1:3001';
  const app=(r)=>`${base}/#${r}`;
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  await page.goto(app('/login'),{waitUntil:'domcontentloaded'});
  await page.locator('input[type=email]').fill('test@example.com');
  await page.locator('input[type=password]').fill('123456');
  await page.locator('form button[type=submit]').click();
  await page.waitForURL('**/#/dashboard');

  const checks=[
    ['/trips/1',320],
    ['/school-shuttles',320]
  ];

  for (const [route,w] of checks){
    await page.setViewportSize({width:w,height:900});
    await page.goto(app(route),{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(80);
    const out=await page.evaluate(()=>{
      const all=[...document.querySelectorAll('*')];
      const offenders=[];
      for(const el of all){
        const cs=getComputedStyle(el);
        if(cs.display==='inline') continue;
        const sw=el.scrollWidth,cw=el.clientWidth;
        if(sw-cw>1){
          offenders.push({tag:el.tagName.toLowerCase(),id:el.id||'',cls:(el.className||'').toString().slice(0,140),diff:sw-cw,sw,cw,overflowX:cs.overflowX});
        }
      }
      offenders.sort((a,b)=>b.diff-a.diff);
      return {hash:location.hash,innerW:window.innerWidth,docW:document.documentElement.scrollWidth,bodyW:document.body.scrollWidth,main:(()=>{const m=document.querySelector('main');return m?{sw:m.scrollWidth,cw:m.clientWidth,diff:m.scrollWidth-m.clientWidth,cls:m.className}:null;})(),top:offenders.slice(0,15)};
    });
    console.log('\nROUTE',route,'W',w);console.log(JSON.stringify(out,null,2));
  }

  await browser.close();
})();
