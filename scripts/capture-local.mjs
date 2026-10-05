import {chromium} from '@playwright/test'
import fs from 'node:fs/promises'
await fs.mkdir('/tmp/justphil-local',{recursive:true})
const browser=await chromium.launch({channel:'chrome',headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 await page.setViewportSize({width,height})
 await page.goto('http://127.0.0.1:5173/')
 await page.waitForTimeout(2600)
 await page.screenshot({path:`/tmp/justphil-local/${name}-top.png`})
 for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(150)}
 await page.waitForTimeout(1000)
 for(const el of await page.locator('main > section,main > div > section,.gallery-desktop,.gallery-mobile,footer').all()){
  if(!await el.isVisible())continue
  const label=(await el.getAttribute('class')||'section').split(' ')[0]
  await el.scrollIntoViewIfNeeded();await page.waitForTimeout(1200)
  await el.screenshot({path:`/tmp/justphil-local/${name}-${label}.png`})
 }
 await fs.writeFile(`/tmp/justphil-local/${name}-rects.json`,JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('main > *,footer')].map(e=>{const r=e.getBoundingClientRect();return {class:e.className,y:r.y+scrollY,h:r.height,w:r.width}})),null,2))
 console.log(name,'captured')
}
await page.setViewportSize({width:1440,height:1000})
for(const route of ['diary','contact']){await page.goto(`http://127.0.0.1:5173/${route}`);await page.waitForTimeout(1500);await page.screenshot({path:`/tmp/justphil-local/${route}-full.png`,fullPage:true})}
await page.goto('http://127.0.0.1:5173/')
const video=page.locator('.designer-image video')
await video.scrollIntoViewIfNeeded()
await page.waitForFunction(()=>document.querySelector('.designer-image video')?.readyState>=2)
const frame=await video.evaluate(async el=>{
 el.pause()
 el.currentTime=1
 await new Promise(resolve=>el.addEventListener('seeked',resolve,{once:true}))
 const canvas=document.createElement('canvas');canvas.width=el.videoWidth;canvas.height=el.videoHeight
 canvas.getContext('2d').drawImage(el,0,0)
 return canvas.toDataURL('image/png').split(',')[1]
})
await fs.writeFile('public/media/mike-kus-poster.png',Buffer.from(frame,'base64'))
await browser.close()
