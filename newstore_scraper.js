const puppeteer = require('puppeteer');
const new_store_url = "https://manager.vince.p.newstore.net/"

const handleLogIn = async (CRED) => {
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
await page.goto(new_store_url);


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