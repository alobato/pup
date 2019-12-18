SSH_USER=deployer HOST=152.67.43.246 REPO=git@github.com:alobato/pup.git pm2 reload pup --update-env


  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  res.send(bodyHTML);

Create .env

USER=your.ssh.user
HOST=your.ip.or.host
REPO=git@github.com:user/project.git


USER=deployer HOST=services.telerison.com REPO=git@github.com:alobato/pup.git pm2 reload pup --update-env





Using Puppeteer, how to generate a PDF with automatic height?
https://stackoverflow.com/questions/52762438/using-puppeteer-how-to-generate-a-pdf-with-automatic-height
const pageHeight = await page.evaluate(() => { window.innerHeight; });
const result = await page.pdf({ height: pageHeight  + 'px' });


puppeteer.launch() versus puppeteer.connect()?
https://stackoverflow.com/questions/52431775/whats-the-performance-difference-of-puppeteer-launch-versus-puppeteer-connect

'--disable-renderer-backgrounding'

      '--disable-background-networking',
      '--enable-features=NetworkService,NetworkServiceInProcess',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-features=TranslateUI',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-sync',
      '--force-color-profile=srgb',
      '--metrics-recording-only',
      '--no-first-run',
      '--enable-automation',
      '--password-store=basic',
      '--use-mock-keychain',




error while loading shared libraries: libX11-xcb.so.1 ubuntu 18

https://techoverflow.net/2018/06/05/how-to-fix-puppetteer-error-while-loading-shared-libraries-libx11-xcb-so-1-cannot-open-shared-object-file-no-such-file-or-directory/

https://github.com/puppeteer/puppeteer/issues/3443

https://www.ostechnix.com/install-microsoft-windows-fonts-ubuntu-16-04/

      https://javascriptwebscrapingguy.com/setting-up-puppeteer-on-ubuntu-16-04-and-digital-ocean/
      sudo apt-get install libx11-xcb1 libxcomposite1 libxi6 libxext6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
https://javascriptwebscrapingguy.com/setting-up-puppeteer-on-ubuntu-18-04-and-digital-ocean/

https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial

https://medium.com/@cloverinks/how-to-fix-puppetteer-error-ibx11-xcb-so-1-on-ubuntu-152c336368