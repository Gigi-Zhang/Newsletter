const express = require("express");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const request = require("request");
const http = require("https");
require("dotenv").config();

const app = express();

// mailchimp config
client.setConfig({
  apiKey: process.env.APIKEY,
  server: process.env.SEVER_PREFIX,
});

// allowing app to use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

// allowing app to use express.static to load static files
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  // getting information from the signup page using body-parser
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  // sending request and creating the data to send to the external server
  const run = async () => {
    const response = await client.lists.batchListMembers(process.env.LIST_ID, {
      members: [{
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }],
    },
    {
      skipMergeValidation: false
    }
  );
    console.log(response.errors[0]);
    if (response.errors[0] === undefined) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/")
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};

app.listen(port, function(req, res) {
  console.log("Server is running on port 3000");
});
