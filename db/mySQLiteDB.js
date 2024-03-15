const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

sqlite3.verbose();

async function connect() {
  return open({
    filename: "./db/fires.db",
    driver: sqlite3.Database,
  });
}

async function getFires() {
  const db = await connect();

  return await db.all(
    `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`
  );
}

async function createFire(newFire) {
  const db = await connect();

  const tableName = newFire.tableName;
  const numAttributes = parseInt(newFire.numAttributes);

  const attributes = [];
  const primaryKeys = [];
  const foreignKeys = [];

  for (let i = 0; i < numAttributes; i++) {
    const attributeName = newFire["attributeName" + i];
    const attributeType = newFire["attributeType" + i];
    const isPrimaryKey = newFire["primaryKey" + i] === "on";
    const isForeignKey = newFire["foreignKey" + i] === "on";
    let referenceTable = null;
    let referenceField = null;

    if (isForeignKey) {
      referenceTable = newFire["foreignKey" + i + "_table"];
      referenceField = newFire["foreignKey" + i + "_field"];
    }

    attributes.push({
      name: attributeName,
      type: attributeType,
      isPrimaryKey,
      isForeignKey,
      referenceTable,
      referenceField,
    });

    if (isPrimaryKey) {
      primaryKeys.push(attributeName);
    }

    if (isForeignKey) {
      foreignKeys.push({ name: attributeName, referenceTable, referenceField });
    }
  }

  // Generating SQL statement
  let sql = `CREATE TABLE ${tableName} (\n`;
  for (let i = 0; i < attributes.length; i++) {
    sql += `${attributes[i].name} ${attributes[i].type}`;
    if (attributes[i].isPrimaryKey) {
      sql += " PRIMARY KEY";
    }
    if (i !== attributes.length - 1) {
      sql += ",\n";
    } else {
      sql += "\n";
    }
  }

  // Add foreign key constraints at the end
  for (let i = 0; i < foreignKeys.length; i++) {
    const { name, referenceTable, referenceField } = foreignKeys[i];
    sql += `, FOREIGN KEY (${name}) REFERENCES ${referenceTable}(${referenceField})`;
  }

  sql += "\n);";

  // Here you can execute the SQL statement in your database
  console.log("Generated SQL statement:");
  console.log(sql);

  const stmt = await db.prepare(sql);

  return await stmt.run();
}

async function getFireByID(fireID) {
  const db = await connect();

  const stmt = await db.prepare(`SELECT *
    FROM Fires
    WHERE
      fireID = :fireID
  `);

  stmt.bind({
    ":fireID": fireID,
  });

  return await stmt.get();
}

async function deleteFire(fireToDelete) {
  const db = await connect();

  let sql = `DROP TABLE IF EXISTS ${fireToDelete.tblName} ;`;

  console.log("Generated SQL statement:");
  console.log(sql);

  const stmt = await db.prepare(sql);

  return await stmt.run();
}

async function displayFire(fireToDisplay) {
  const db = await connect();

  let sql = `SELECT * FROM ${fireToDisplay} ;`;

  console.log("Generated SQL statement:");
  console.log(sql);
  const stmt = await db.prepare(sql);

  //const rows = await stmt.all();
  
  const rows = await stmt.all();
  console.log("***** Rows are: ", rows);
  return rows;

  // return rows; // Return the fetched rows directly

  //console.log("after db.prepare, stmt= ", stmt);
  /*** 
  await stmt.run(); // Await here if necessary
  console.log("after stmt.run!");
  try {
    const rows = await stmt.all(); // Await stmt.all()
    console.log("The rows are:");
    console.log(rows); // Use console.log(rows) for logging
    //res.json(rows);
  } catch (err) {
    console.error(`Error fetching data from table ${fireToDisplay}:`, err);
    //res.status(500).send(`Error fetching data from table ${fireToDisplay}`);
  } finally {
    await stmt.finalize(); // Finalize within a finally block
  }
  **/
  //---------------------------
  /**
const rows = await stmt.all(); // Await stmt.all()
stmt.bind({
  ":tableData": rows,
});

return await stmt.get();
**/
  //-----------------------------

  console.log("End of displayFire!");
}

async function modifyDB(sql1) {
  const db = await connect();

  console.log("in.. modifyDB!");
  console.log("sql1 is: ", sql1);
  //console.log("sql2 is: ", sql2);
  const stmt1 = await db.prepare(sql1);

  await stmt1.run();
  //await stmt2.run();
  console.log("end of.. modifyDB!");
  return await stmt1.get();
}

module.exports.getFires = getFires;
module.exports.createFire = createFire;
module.exports.deleteFire = deleteFire;
module.exports.getFireByID = getFireByID;
module.exports.displayFire = displayFire;
module.exports.modifyDB = modifyDB;
