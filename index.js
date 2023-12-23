import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    userDataDir: "./tmp",
  });
  const page = await browser.newPage();
  await page.goto('https://www.amazon.com/s?k=office+chair+wheels&crid=191F26OFNMQVU&sprefix=office+chair+wheels%2Caps%2C162&ref=nb_sb_noss_1');

  const productsHandler = await page.$$(' div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item')

  let items = [];

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
    }
  }

  console.log(items.length)
})();