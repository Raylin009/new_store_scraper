const puppeteer = require('puppeteer');
const domain = 'https://www.amazon.com/s?k=office+chair+wheels&page=6&crid=191F26OFNMQVU&qid=1703391448&sprefix=office+chair+wheels%2Caps%2C162&ref=sr_pg_6'
const { appendFile } = require('fs').promises;

const scraper = async (domain) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(domain, { waitUntil: "load"})

  // const next_page_button_status = await page.evaluate(ele => ele.classList.contains('s-pagination-disabled'), next_page_button)
  let next_page_button_status = false
  let pageNumber = 1
  while (next_page_button_status === false){
    //get data from page
    await new Promise((resolve)=>setTimeout(resolve, 1000))
    console.log("wait complete")
    //write to json file
    const data = {pageNumber, str: "ha"}
    const stringed = JSON.stringify(data);
    try {
      await appendFile('./data.json', `${stringed},`)
      console.log(` wrote ${stringed} to data.json`)
    } catch (error) {
      throw error
    }
    console.log(pageNumber)
    pageNumber++
    //go to next page
    const next_page_button = await page.$('.s-pagination-next');
    await next_page_button.click()
    //update next_page_button_status
    next_page_button_status = await page.evaluate(ele => ele.classList.contains('s-pagination-disabled'), next_page_button)

  } 


  // console.log(next_page_button_status)



  await browser.close();

}

scraper(domain)



// page 1 next button attribute
// s-pagination-item s-pagination-next s-pagination-button s-pagination-separator

// pade 7 next button attribute
// s-pagination-item s-pagination-next s-pagination-disabled 