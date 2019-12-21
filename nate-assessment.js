var https = require("https");
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var WordCounter = require('wordcounter');
var wordcounter = new WordCounter({
    mincount: 1,
    minlength: 1,
    ignore: [],
    ignorecase: true
  });
var app = express();

// Running Server Details.
var server = app.listen(3000, function () {
  var port = server.address().port
  console.log("Example app listening at :%s Port", port)
});

var result = "";
var getDataPromise;
function getData(inputURL)
{
   return new Promise((resolve,reject) =>
    {
        https.get(inputURL, (resp) =>
        {
            resp.on('data', (value) => {
            result =  result + value.toString();
            fs.writeFile('URLData.txt', result, function (err) {
                if (err) throw err;
                });
            });
            resp.on('end', () =>{
                resolve(result);
            })
        })
    })
}

app.get('/', function (req, res) {
  var html='';
  html +="<body>";
  html += "<form action='/'  method='post' name='form1'>";
  html += "Enter Url:<input type='url' name='url'>"
  html += "<button>Send</button>"
  html += "</form>";
  html += "</body>";
  res.send(html);
});
 
app.post('/', urlencodedParser, function (req, res){
    var html='';
    getDataPromise = getData(req.body.url)
    getDataPromise.then(function()
    {
      fs.readFile('URLData.txt',function(err,data)
      {
            data = wordcounter.count(data.toString());
            data=JSON.stringify(data);
            data = data.replace(/{"word":"/g,"");
            data = data.replace(/","count"/g,"");
            data = data.split("},").join(",<br/>");
            data = data.replace(/}/,"");
            data = data.replace(/[\[\]]/g,"");
            html +="<body>";
            html += "<form action='/'  method='post' name='form1'>";
            html += "Enter Url:<input type='url' name='url'>"
            html += "<button>Send</button>"
            html += "</form>";
            html += "</body>";
            res.send(html+data);
            fs.unlinkSync('URLData.txt', (err) =>
            {
                if(err)
                    console.error(err);
            })
            res.end();
        })
    })
});