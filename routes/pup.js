const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

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

router.get('/', async (req, res) => {
  try {

    const { h, c = '', url, z = 4, l } = req.query

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
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8" /><style>${css}</style></head><body style="margin:0;padding:0;"><div id="main" style="display:inline-block;">${h}</div></body></html>`
    await page.goto(`data:text/html,${html}`, { waitUntil: 'networkidle0' })
    const filename = Math.random().toString(36).substring(7)
    await page.screenshot({path: path.join('./public/', `${filename}.png`)})
    const bodyHandle = await page.$('#main')
    const { width, height } = await bodyHandle.boundingBox()
    await page.screenshot({ path: path.join('./public/', `${filename}.png`), clip: { x: 0, y: 0, width, height }, type: 'png' })  
    await bodyHandle.dispose()
  
    if (l) {
      await browser.close()
    } else {
      await browser.disconnect()
    }
  
    if (url) {
      return res.send({ url: `http://localhost:8000/${filename}.png` })
    }
    res.contentType('image/png') 
    return res.sendFile(path.resolve('./public/', `${filename}.png`))

  } catch(err) {
    console.log('err', err)
    return res.send({ success: false })
  }

})

router.get('/test', async (req, res) => {
  return res.send({ success: true })
})

module.exports = router
