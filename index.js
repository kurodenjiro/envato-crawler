//http://elements.envato.com/api/v1/items.json?type=photos&page=51&languageCode=en&tags=youngs

const puppeteer = require('puppeteer');
var mongoose = require('mongoose');
require('dotenv').config();
var data=[];
mongoose.connect("mongodb://localhost:27017/envato", {useNewUrlParser: true,useUnifiedTopology: true,'useFindAndModify': false});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error: '));
db.once('open', function(callback) {
    console.log('Successfully connected to MongoDB.');
});

Schema = mongoose.Schema;
var listUrlSchema = new Schema({
    _id: Schema.ObjectId,
    title:{type : String},
    url:{type : String},
    status:{type:String},
    day_crawk:{type:String}
} ,{ collection : 'listUrl' })

var listUrl = mongoose.model('listUrl',listUrlSchema);


(async () => {
  const browser = await puppeteer.launch({headless: false}); // default is true
  const page = await browser.newPage();
  await page.goto('https://elements.envato.com/');
  
  
  function login(){
	  
	  
  }
  
  
  //check login
  if (await page.$("[data-test-selector='pageheader-user-auth-link']") !== null) console.log('Logged');
  else {
  console.log("Not Login!!!");
  console.log("Waiting for Login!!!");
  await page.goto('https://elements.envato.com/sign-in');
  await page.type('#signInUsername', process.env.ENVATO_USER);
  await page.type('#signInPassword', process.env.ENVATO_PWD);
  await page.click('[data-test-selector="sign-in-submit"]');
  console.log("Loggin!!!");
};
	var count = 0;
	for (i = 1; i <= 50; i++) {
	await page.goto('https://elements.envato.com/photos/pg-'+i)
		const link = await page.evaluate(() => {
			let photogrid = [];
			
			document.querySelectorAll('[data-test-selector="photogrid-photo"]').forEach(item => {
				photogrid.push({
					title: item.innerText,
					url: item.firstElementChild.href
				});

				
			});
			return photogrid;
		})	
		
                                                listUrl.insertMany(link)		
	}
	
	//await page.click('[data-test-selector="action-bar-download-button"]')
	await page.waitForNavigation();
	await browser.close();
})();
