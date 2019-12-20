const https = require('https');
const express = require("express");
const fs = require('fs');
const es = require('event-stream');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var WordCounter = require('wordcounter');
var wordcounter = new WordCounter({
      mincount: 1,
      minlength: 1,
      ignore: [],
      ignorecase: false
    });
//const countWords = require('count-words-occurrence');
const countWords = require('word-count-frequency');
var result = "";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./Nate_Url.html'));

app.post('/send',  function (req, res) {
  console.log("Inside function",req.body.enter_url);
  var getData = new Promise((resolve,reject)=>{
  https.get(req.body.enter_url, (res1) =>
  {
    res1.on('data', (value) => {
      result = result + value.toString();
      fs.appendFile('res.txt', result, function (err) {
        if (err) throw err;
       // console.log('Saved!');
        //resolve(result);

      });
     // resolve(result);
    })
    resolve(result);
   
  })
})
var count = new Promise((resolve,reject)=>{


  fs.readFile('res.txt', function(err, data) {
    if (err) {
      throw err;
    }
  
    data = wordcounter.count(data.toString());
  console.log(data);
    fs.writeFile('resultnate1.json', JSON.stringify(data), function (err) {
      if (err) {
        throw err;
      }
  
      console.log('Done, without errors.');
    });
  });
})


getData.then((result) =>{
  console.log(result);
  count.then((countres)=>{
      console.log("Done");
  })
})	
		

	
});
app.get("/", (req, res) => {
	 res.sendfile('./Nate_Url.html');
});

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});

