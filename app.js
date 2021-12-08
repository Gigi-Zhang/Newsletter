const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var eamil = req.body.email;

  var data = {
    members: [{
      email_address: eamil,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]

  };

  const jsonData = JSON.stringify(data);

  const apiKey = "d78b3722cc6155890da5e03d2e45739b-us5";
  const listId = "663f994adf";
  const url = "https://us5.api.mailchimp.com/3.0/lists/663f994adf";
  const options = {
    method: "POST",
    auth: "gigi:d78b3722cc6155890da5e03d2e45739b-us5"
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  request.write(jsonData);
  request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
})
