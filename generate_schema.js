const fetch = require("node-fetch");
const fs = require("fs");

fetch(`http://dev-api-hub-hotel-static.xmltravelgate.com/list/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer q8ggxpoVDW76Kw918hwnnRvxlZmAP2QZ"
    },
    body: JSON.stringify({
      query:
        "{\n        __schema {\n          types {\n            kind\n            name\n            possibleTypes {\n              name\n            }\n          }\n        }\n      }",
      variables: null
    })
  })
    .then(result => {
      return result.json();
    })
    .then(result => {
      // here we're filtering out any type information unrelated to unions or interfaces
      const filteredData = result.data.__schema.types.filter(
        type => type.possibleTypes !== null
      );
      result.data.__schema.types = filteredData;
      fs.writeFile("./src/app/core/fragmentTypes.json", JSON.stringify(result.data), err => {
        if (err) console.error("Error writing fragmentTypes file", err);
        console.log("Fragment types successfully extracted!");
      });
    });

