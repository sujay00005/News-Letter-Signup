const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require('https');

const app = express();

mailchimp.setConfig({
  apiKey: "9bb1147edd1c5eae956dceb2eb347a5d-us5",
  server: "us5",
});


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/',function(req,res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    console.log(firstName+ ' '+ lastName+ ' ' + email);


    var data = {
         members: [ 
            {
                  email_address: email,
                  status: 'subscribed',
                  merge_fields: {
                      FNAME: firstName,
                      LNAME: lastName, 
                  }
        }],
    }
    const jsonData = JSON.stringify(data);
    const url = 'https://us5.api.mailchimp.com/3.0/lists/dd26cf7c18';

    const options = {
        method: "POST",
        auth: "sujay00005:9bb1147edd1c5eae956dceb2eb347a5d-us5"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    
    request.write(jsonData);
    request.end();
});



app.post('/failure',function(req,res){
    res.redirect('/');
}); 

app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running on port 3000');
})
// API Key
// 9bb1147edd1c5eae956dceb2eb347a5d-us5
//List ID
// dd26cf7c18


