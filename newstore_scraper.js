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

const setQuaryParam = async(page, store_location, date_range) => {
  const loading_indicator = 'div.rt-noData';
  let paramURL = "https://manager.vince.p.newstore.net/sales/orders?page=0&pageSize=100&dir=asc&sortBy=placedAt"
  const handleStoreLocationQuery = (store_location) => {
    return `&filters%5BplacementLocation.label%5D%5B%5D=${store_location}`
  }
  const handleDateRangeQuery = ({st_date, end_date}) => {
    return `&filters%5BplacedAt%5D%5Bmin%5D=${st_date}&filters%5BplacedAt%5D%5Bmax%5D=${end_date}`
  }
  paramURL = paramURL.concat(handleStoreLocationQuery(store_location), handleDateRangeQuery(date_range))
  await page.goto(paramURL, {waitUntil: "networkidle0"})
  await page.waitForSelector(loading_indicator, { hidden: true });
  return
}

const setDisplayParam = async(page)=>{
  const displayParam = {
    "Associate": true,
    "Date_time": true,
    "Channel_type": false,
    "Channel" : false,
    "Fulfillment": false,
    "Demand_location": false,
    "Fulfillment_location": false,
    "Carrier": false,
    "Shipment_method": false,
    "Total": true,
    "Discount": false,
    "Status": false,
  }

}

const getOrderIdsOnPage = async(page) => {
  const ordersHandler = await page.$$("div.rt-table > div.rt-tbody > div.rt-tr-group")
  for( order of ordersHandler){
    try {
      const order_id = await page.evaluate( el => el.querySelector("div.rt-tr > div.rt-td > a").textContent, order)
      const order_href = await page.evaluate( el => el.querySelector("div.rt-tr > div.rt-td > a").href, order)
      console.table({order_id, order_href})
    } catch (e) {
      console.log(e)
    }
    try {
      const date_time = await page.evaluate( el => el.querySelector("span").textContent, order)
    } catch (e) {
      console.log(e)
    }
    
  }
}


const newstore_scraper = async() => {
//goto https://manager.vince.p.newstore.net/
// const loading_indicator = 'div.rt-noData';

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

//set quary param and sorting order
await setQuaryParam(page, "5926-SFPREMIUMOUTLETS", {st_date: "2023-12-23", end_date:"2023-12-24"})

//set display parameter
// await setDisplayParam(page)

//get data page by page
await getOrderIdsOnPage(page);

//change display rows to 100
// await page.select("span.-pageSizeOptions > select", "100")
// await page.waitForSelector(loading_indicator, { hidden: true });
// await page.screenshot({path: "screenshot.png"})
// console.log(page)








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