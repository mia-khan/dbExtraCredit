let express = require("express");
let router = express.Router();

const myDB = require("../db/MySqliteDB.js");

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const fires = await myDB.getFires();

  console.log("got fires", fires);

  // render the _index_ template with the fires attrib as the list of fires
  res.render("index", { fires: fires });
});

/* GET DB details. */
router.get("/fires/:fireID", async function (req, res) {
  console.log("Got DB details");

  const fireID = req.params.fireID;

  console.log("get details for DB: ", fireID);

  console.log("DB displayed");
  try {
    console.log("---->Trying the displayFire call");
    const dbRows = await myDB.displayFire(fireID);
    res.json(dbRows); // Send the fetched rows back to the frontend
    //res.render("index", dbRows);
    console.log("<----After Trying the displayFire call. dbRows= ", dbRows);
  } catch (err) {
    console.log(`Error displaying data from table ${fireID}:`, err);
    res.status(500).send(`Error displaying data from table ${fireID}`);
  }
  console.log("DB display End!");
});

/* POST create fires. */
router.post("/fires/create", async function (req, res) {
  console.log("Got post create/fires");

  const fire = req.body;

  console.log("got create fire", fire);

  await myDB.createFire(fire);

  console.log("Fire created");

  res.redirect("/");
});

/* POST delete fires. */
router.post("/fires/delete", async function (req, res) {
  console.log("Got post delete fire");

  const fire = req.body;

  console.log("got delete fire", fire);

  await myDB.deleteFire(fire);

  console.log("Fire deleted");

  res.redirect("/");
});

/* POST display fires. */
router.post("/fires/modify", (req, res) => {
  const { tableName, existingAttributeName, newAttributeName } = req.body;

  // Validate inputs (e.g., check if table exists, attribute exists, etc.)
  console.log("Inside fires/modify");

  // Execute SQL query to modify table
  const sql = `ALTER TABLE ${tableName} RENAME COLUMN ${existingAttributeName} TO ${newAttributeName};`;
  //const sql2 = `ALTER TABLE ${tableName} MODIFY COLUMN ${newAttributeName} ${newAttributeType};`;

  myDB.modifyDB(sql);
  console.log("End of router /fires/modify DB should be modified now");
  res.redirect("/");
});

module.exports = router;
