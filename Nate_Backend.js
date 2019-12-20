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
  https.get(req.body.enter_url, (res1) =>
  {
    res1.on('data', (value) => {
      result = value.toString();
      fs.appendFile('res.txt', result, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    })
  })

	
		

	
});
app.get("/", (req, res) => {
	 res.sendfile('./Nate_Url.html');
});

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});

