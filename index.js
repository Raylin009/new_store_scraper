const puppeteer = require('puppeteer');
const { appendFile } = require('fs').promises;


(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  let pageNumber = 1;
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/s?k=office+chair+wheels&crid=191F26OFNMQVU&qid=1703376409&sprefix=office+chair+wheels%2Caps%2C162&ref=sr_pg_1');

  let items = [];
  let isBtnDisabled = false;
  
  while(!isBtnDisabled){
    await new Promise(resolve => setTimeout(resolve, 5000))
    const productsHandler = await page.$$(' div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')
    for (const producthandle of productsHandler){
      let title = "Null";
      let price = "Null";
      let imgURL = "Null";

      try {
        title = await page.evaluate(el => el.querySelector("h2 > a > span").textContent, producthandle)
      } catch (error) {}
      try {
        imgURL = await page.evaluate(el => el.querySelector(".s-image").getAttribute("src"), producthandle)
      } catch (error) {}
      try {
        price = await page.evaluate(el => el.querySelector(".a-price > .a-offscreen").textContent, producthandle)
      } catch (error) {}

      if(title !== "Null"){
        items.push({title, price, imgURL})
        data = JSON.stringify({title, price, imgURL})
        try {
          await appendFile('./data.json', `${data},`)
          console.log(` wrote ${data} to data.json`)
        } catch (error) {
          throw error
        }
      }
    }

    await page.waitForSelector(".s-pagination-next", {visible: true})
    const is_disabled = await page.$('.s-pagination-next.s-pagination-disabled') !== null;
    isBtnDisabled = is_disabled
    console.table({pageNumber, itemsLenght: items.length})
    pageNumber++
    if(!is_disabled){
      await Promise.all([
        page.click("a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator"),
        page.waitForNavigation({waitUntil: "networkidle2"})
      ])
    }
  }

  // console.log(items.length)
})();