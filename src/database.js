// Needs correcting: To run this project is necessary to update the version of the sqlite3 package to the latest version. You can do this by running the following command: https://www.npmjs.com/package/sqlite3
const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sqlite";

// Needs correcting: A good practice when we are working with databases is to create a connection pool to avoid the overhead of creating a new connection every time we need to interact with the database. Also, it is important to close the connection when we are done with it.
// I'll let you a link to the documentation of the sqlite3 package: https://www.npmjs.com/package/sqlite3#usage
// There you will have an example about how to initialize the database connection and how to close it. And also how to use serialize() to create the firs database.

const db = new sqlite3.Database(DBSOURCE, (err) => {
  // Needs correcting:
  // It is very important to have correctly formatted code to improve readability.
  // It is recommended to use a linter to identify errors: https://www.npmjs.com/package/eslint
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQlite database.");
    db.run(
      `CREATE TABLE article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            body text, 
            date text
            )`,
      (err) => {
        if (err) {
          console.log("Table already created");
        } else {
          console.log("Table just created");
        }
      }
    );
  }
});

module.exports = db;
