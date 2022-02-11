const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mailchimp.setConfig({
  apiKey: process.env.APIKEY,
  server: process.env.SEVER_PREFIX,
});

//GET INFORMATIONS ABOUT ALL AUDIANCE
// const run = async () => {
//   const response = await mailchimp.lists.getAllLists();
//   console.log(response);
// };
//
// run();

//GET INFORMATIONS ABOUT SPECEFIC AUDIANCE
// const getList = async () => {
//   const response = await mailchimp.lists.getList("ea08ba2f0e");
//   console.log(response);
// };
//
// getList();
//

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
//
app.post("/", async (req, res) => {
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var email = req.body.email;

      const apiKey = process.env.APIKEY;
      const listId = process.env.LIST_ID;

      //Member sync comes from add member method in mailchimp
      const data = await mailchimp.lists.addListMember(process.env.LIST_ID, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });

      const jsonData = JSON.stringify(data);

      const url = process.env.URL;
      const options = {
        method: "POST",
        auth: process.env.OPTIONS_AUTH
      }

      const request = https.request(url, options, function(response) {
          if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
          } else {
            res.sendFile(__dirname + "/failure.html");
          };

          console.log(response);
          response.on("data", function(data) {
              if (data != null) {
                console.log(JSON.parse(data));
                }
          });
        });

        request.write(jsonData);
        request.end();
      });

    app.post("/failure", function(req, res) {
      res.redirect("/");
    });

    app.listen(process.env.PORT || 3000, function() {
      console.log("Server is running on port 3000.")
    });
