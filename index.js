const express = require("express");
const expressGraphQL = require("express-graphql");
const schema = require("./schema/index");

const app = express();

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true
  })
);

app.listen(4000, () => {
  console.log("Listening on Port 4000");
});
