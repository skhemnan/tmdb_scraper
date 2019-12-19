const axios = require("axios");
const csvParser = require("json2csv").Parser;
const fastcsv = require("fast-csv");
const fs = require("fs");
const sleep = require("sleep");


let pageNum = 1;
let arrayOfObjects = [];
let date1 = "2019-01-01" //process.argv[2];
let date2 = "2019-03-31" //process.argv[3];
let api_key = "56f5a1da630d80aa6c501617a2bc5e72" 

async function runScript(pages) {
  for (pageNum; pageNum <= pages; pageNum++) {
		console.log(`Scraping ${pageNum} of ${pages}`);
    let url = `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${date1}&primary_release_date.lte=${date2}&language=en&api_key=${api_key}&page=${pageNum}`;
		console.log(url);
		sleep.sleep(1);
    let res = await axios.get(url);
    let array = res.data.results;
    getMovieNames(array);
  }
  exportToCSV();
}

function getMovieNames(array) {
  array.forEach(item => {
    let obj = {
      name: item.original_title,
      release: item.release_date,
      popularity: item.popularity
    };
    arrayOfObjects.push(obj);
  });
}

function getNumberOfPages() {
  let url = `https://api.themoviedb.org/3/discover/movie/?primary_release_date.gte=${date1}&primary_release_date.lte=${date2}&language=en&api_key=${api_key}`;
  axios.get(url).then(res => {
    let pages = res.data.total_pages;
    runScript(pages);
  });
}

function exportToCSV() {
  const fields = ["name", "release", "popularity"];
  const parser = new csvParser({ fields });
  const csv = parser.parse(arrayOfObjects);
  fs.writeFile("out.csv", csv, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("csv saved!");
  });
}

getNumberOfPages();
