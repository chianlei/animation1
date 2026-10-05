import {chromium} from '@playwright/test'
import fs from 'node:fs/promises'
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 await page.setViewportSize({width,height})
 await page.goto('https://www.justphilride.co.uk/',{waitUntil:'domcontentloaded'})
 await page.waitForTimeout(3000)
 const data=await page.evaluate(()=>[...document.querySelectorAll('[data-framer-name],h1,h2,h3,h4,p')].filter(e=>e.getBoundingClientRect().width).map(e=>{
 const r=e.getBoundingClientRect(),s=getComputedStyle(e)
 return {name:e.dataset.framerName,tag:e.tagName,class:typeof e.className==='string'?e.className:'',text:e.innerText?.slice(0,100),rect:{x:r.x,y:r.y+scrollY,w:r.width,h:r.height},style:Object.fromEntries(['position','padding','gap','fontFamily','fontSize','lineHeight','letterSpacing','backgroundColor','color','borderRadius','textTransform','transform','mixBlendMode','opacity','justifyContent','alignItems','flexDirection'].map(k=>[k,s[k]]))}
 }))
 await fs.writeFile(`/tmp/justphil-reference/${name}-details.json`,JSON.stringify(data,null,2))
 await page.screenshot({path:`/tmp/justphil-reference/${name}-top.png`})
 if(name==='mobile'){
  for(const el of await page.locator('section,[data-framer-name="Large header"],[data-framer-name="Photos Mobile"],footer').all()){
   if(!await el.isVisible())continue
   const label=(await el.getAttribute('data-framer-name')||'section').replace(/[^a-z0-9]/gi,'-')
   await el.scrollIntoViewIfNeeded();await page.waitForTimeout(800)
   await el.screenshot({path:`/tmp/justphil-reference/mobile-${label}.png`})
  }
 }
 console.log(name,'details captured')
}
await browser.close()
