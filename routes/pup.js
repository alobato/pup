require('dotenv').config()
const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const md5 = require('md5')
// const cache = require('memory-cache')

const onDisconnected = async () => {
  console.log('Disconnected!')
}

router.get('/open', async (req, res) => {
  const { z = 4 } = req.query
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 648, height: 648, deviceScaleFactor: z } })  
  await writeFileAsync('ws.txt', browser.wsEndpoint())
  return res.send({ ws: browser.wsEndpoint() })
})

router.get('/close', async (req, res) => {  
  let browser
  try {
    const ws = await readFileAsync('ws.txt', 'utf8')
    browser = await puppeteer.connect({ browserWSEndpoint: ws })
    browser.on('disconnected', onDisconnected)
    await browser.close()
    return res.send({ success: true })
  } catch (error) {
    console.error(error.message)
    await browser.close()
    return res.send({ success: false })
  }
})

const respondData = (res, filename, t) => {
  if (t === 'b64') {
    const b64 = fs.readFileSync(path.resolve('./public/', `${filename}.png`), { encoding: 'base64' })
    return res.send({ base64: `data:image/png;base64,${b64}` })
  } else if (t === 'url') {
    return res.send({ url: `http://${process.env.HOST}/${filename}.png` })
  }
  res.contentType('image/png') 
  return res.sendFile(path.resolve('./public/', `${filename}.png`))
}

router.get('/', async (req, res) => {
  try {

    // h -> html, c -> css, z -> zoom, l -> launch, t -> type (b64, url)
    const { h, c = '', z = 4, l, t = '' } = req.query

    const hash = md5(`${c}${h}${z}`)

    if (fs.existsSync(path.join('./public/', `${hash}.png`))) {
      return respondData(res, hash, t)
    }

    // const cachedFileName = cache.get(hash)
    // if (cachedFileName) {
    //   return respondData(res, cachedFileName, t)
    // }

    const css = `
*, *::before, *::after {
  box-sizing: border-box;
}
html {
  font-family: sans-serif;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
body {
  margin: 0;
}
${c}
`

    let browser
    if (l) {
      browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 648, height: 648, deviceScaleFactor: z } })
    } else {
      const ws = await readFileAsync('ws.txt', 'utf8')
      browser = await puppeteer.connect({ browserWSEndpoint: ws, defaultViewport: { width: 648, height: 648, deviceScaleFactor: z } })
    }
  
    const page = await browser.newPage()

    let html = h
    if (!h.toLowerCase().startsWith('<!doctype')) {
      html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8" /><style>${css}</style></head><body style="margin:0;padding:0;"><div id="main" style="display:inline-block;">${h}</div></body></html>`
    }

    await page.goto(`data:text/html,${encodeURIComponent(html)}`, { waitUntil: 'networkidle0' })
    // const filename = Math.random().toString(36).substring(7)
    const filename = hash
    await page.screenshot({path: path.join('./public/', `${filename}.png`)})
    const bodyHandle = await page.$('#main')
    const { width, height } = await bodyHandle.boundingBox()
    await page.screenshot({ path: path.join('./public/', `${filename}.png`), clip: { x: 0, y: 0, width, height }, type: 'png' })  
    
    // cache.put(hash, filename)
    
    await bodyHandle.dispose()
  
    if (l) {
      await browser.close()
    } else {
      await browser.disconnect()
    }

    return respondData(res, filename, t)

  } catch(err) {
    console.log('err', err)
    return res.send({ success: false })
  }

})

router.get('/test', async (req, res) => {
  return res.send({ success: true })
})

module.exports = router
