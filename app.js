const express = require("express");
const app = express();
const bodyparser = require("body-parser");
//const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/",function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const emailaddress = req.body.em;
    const jsondata = JSON.stringify(
        {
            members:[
                {
                    email_address: emailaddress,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstname,
                        LNAME: lastname
                    }
                }
            ]
        }
    )
    const url=" https://us21.api.mailchimp.com/3.0/lists/7da2bd20ca";
    const options = {
        method:"POST",
        auth:"webd:99b932be8ec23fb32df0a3a093f1b5a1-us21"

    }
    const request=https.request(url,options,function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+'/success.html');
        }
        else{
            res.sendFile(__dirname+'/failure.html');
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsondata);
    request.end();
})
app.post('/failure',function(req,res){
    res.redirect('/');
})

app.listen(process.env.PORT||3000,function(){
    console.log("server is running on port 3000");
});

//99b932be8ec23fb32df0a3a093f1b5a1-us21

//7da2bd20ca