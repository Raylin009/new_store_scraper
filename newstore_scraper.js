const puppeteer = require('puppeteer');
const new_store_url = "https://manager.vince.p.newstore.net/";
const CRED = require('./CRED.json');
const fsp = require('fs').promises;

const getCRED = async () => {
  try {
    const data = await fsp.readFile('CRED.json', 'utf8');
    return JSON.parse(data)
  } catch (error) {
    throw new Error()
  }
}

const handleLogIn = async (page) => {
  const {username, password} = await getCRED()
  await page
    .locator("#root > div > div > aside > div > div > a")
    .click()
  await page.waitForSelector('#login-form > form', { visible: true });
  await page.type('#login-form > form input[type="email"]', username);
  await page.type('#login-form > form input[type="password"]', password);
  await Promise.all([
    page.click('#login-form > form button[type="submit"]'),
    page.waitForNavigation({waitUntil: 'networkidle0'})
  ])
  return 
}

const newstore_scraper = async() => {
//goto https://manager.vince.p.newstore.net/
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: false,
  userDataDir: "./tmp",
});
const page = await browser.newPage();
await page.goto(new_store_url,{ waitUntil: 'networkidle0' });
//check if login is needed
if(page.url()== new_store_url) {
  await handleLogIn(page, CRED);
}







//login

//get data sales > orders > 5936 SFOUTLET > today
  //go into each order id
    // get 
      /**
       * order id
       * orderdate/time
       * orderchannel type
       * order fulfillment type
       * order demand location
       * order fulfillment location
       * order associate
       * 
       * product name
       * product color
       * product size
       * product SKU
       * product UPC
       * product ID
       * product status
       * product price
       * product discount
       * product disc. price
       * product quantity
       * 
       * customer ID 
       * customer Name
       * customer email
       * 
       * order subtotal
       * order total discounts
       * order total after discount
       * order taxes
       * order totoal
       */

}

newstore_scraper()