const axios = require("axios");
const fs = require("fs");
const APP_URL = "https://angular.io/guide/example-apps-list";

const test = async () => {
  const response = await axios.get(`${APP_URL}&render=true`);
  const body = response.data;
  fs.writeFile("files/others.text", body, "utf8", function (err) {
    if (err) {
      console.log(
        "Some error occured - file either not saved or corrupted file saved."
      );
    } else {
      console.log("It's saved!");
    }
  });
};

test();
