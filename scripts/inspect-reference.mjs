import { chromium } from '@playwright/test'
import fs from 'node:fs/promises'
const out = '/tmp/justphil-reference'
await fs.mkdir(out, {recursive:true})
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless:true, args:['--disable-gpu']})
const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1})
for(const route of ['', 'diary', 'contact']) {
 await page.goto(`https://www.justphilride.co.uk/${route}`,{waitUntil:'domcontentloaded'})
 await page.waitForTimeout(3500)
 const name = route || 'home'
 await fs.writeFile(`${out}/${name}.html`,await page.content())
 const height = await page.evaluate(()=>document.body.scrollHeight)
 for(let y=0;y<height;y+=700) {await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(250)}
 await page.waitForTimeout(1200)
 const data = await page.evaluate(()=>{
  const selectors=['nav','main[data-framer-name="Main"] > *','footer','section','[data-framer-name="Large header"]','[data-framer-name="Photos"]']
  const nodes=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))].filter(e=>e.getBoundingClientRect().width && e.getBoundingClientRect().height)
  const props=['display','position','width','height','padding','gap','margin','backgroundColor','color','fontFamily','fontSize','lineHeight','letterSpacing','textTransform','border','borderRadius','gridTemplateColumns','alignItems','justifyContent','flexDirection','mixBlendMode','transform']
  function describe(e){const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return {tag:e.tagName,name:e.dataset.framerName,class:e.className,id:e.id,rect:{x:r.x,y:r.y+scrollY,width:r.width,height:r.height},styles:Object.fromEntries(props.map(p=>[p,cs[p]])),text:e.innerText?.slice(0,250),children:[...e.children].filter(c=>c.getBoundingClientRect().width).map(c=>({tag:c.tagName,name:c.dataset.framerName,class:c.className,rect:{width:c.getBoundingClientRect().width,height:c.getBoundingClientRect().height},styles:Object.fromEntries(props.map(p=>[p,getComputedStyle(c)[p]]))}))}}
  return {height:document.body.scrollHeight,nodes:nodes.map(describe),links:[...document.querySelectorAll('a')].map(e=>({text:e.textContent,href:e.href})),images:[...document.images].map(e=>({src:e.src,alt:e.alt}))}
 })
 await fs.writeFile(`${out}/${name}.json`,JSON.stringify(data,null,2))
 for(const el of await page.locator('section, [data-framer-name="Large header"], [data-framer-name="Photos"], footer').all()){
  if(!await el.isVisible())continue
  const label=(await el.getAttribute('data-framer-name')||'section').replace(/[^a-z0-9]/gi,'-')
  await el.scrollIntoViewIfNeeded();await page.waitForTimeout(1200)
  await el.screenshot({path:`${out}/${name}-${label}.png`,timeout:15000})
 }
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1500)
 await page.screenshot({path:`${out}/${name}-full.png`,fullPage:true})
 console.log(name, height, 'captured')
}
await page.setViewportSize({width:390,height:844})
await page.goto('https://www.justphilride.co.uk/',{waitUntil:'domcontentloaded'})
await page.waitForTimeout(3500)
for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=600){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(150)}
await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(1500)
await page.screenshot({path:`${out}/home-mobile-full.png`,fullPage:true})
await fs.writeFile(`${out}/home-mobile.html`,await page.content())
await browser.close()
