const express = require("express");
const db = require("./database.js");

const router = express.Router();

// Well done: Following the RESTful API conventions is a good practice. You did a good job!
router.get("/api/articles", (req, res, next) => {
  // Can be improved: When we work with queries a convention is user uppercase for SQL commands and lowercase for the rest of the query. This helps to improve the readability of the code. You can find more information about SQL conventions here:
  const sql = "select * from article";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(403).json({ error: err.message });
      return;
    }
    res.json({
      message: "Success",
      data: rows,
    });
  });
});

router.get("/api/article/:id", (req, res, next) => {
  // Needs correcting: When we are working with databases, it is important to avoid SQL injection attacks. A better practice is to use the "?" character as a placeholder in the query and pass the parameters in an array as the second argument of the function. You can check more about sql injection here https://www.w3schools.com/sql/sql_injection.asp and how to avoid them here https://planetscale.com/blog/how-to-prevent-sql-injection-attacks-in-node-js
  const sql = `select * from article where id = ${req.params.id}`;
  // Needs correcting: params is not being used in the query. So, in this case, it is not necessary to declare it.
  const params = [];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(403).json({ error: err.message });
      return;
    }
    // Can be better: Before submitting work, please make sure that all lines of code containing debugger and console.log are deleted.
    console.log("row: ", row);
    // Needs correcting: (This is applicable to all the endpoints) It's very importat use status code in our APIs, to help the client to understand what happened. Even when the result is successfull. You can check the status code list here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    res.json({
      message: "Success",
      data: row,
    });
  });
});

// Can be improved: (Applicable to all endpoints too) When we are declaring endpoints, besides /api/ we should also include the version of the API. This is important because it allows us to make changes to the API without breaking the client's code. You can find more information about versioning here: https://restfulapi.net/versioning/
router.post("/api/article/", (req, res, next) => {
  const errors = [];
  if (!req.body.title) {
    errors.push("title is required");
  }
  if (!req.body.body) {
    errors.push("body is required");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }
  const data = {
    title: req.body.title,
    body: req.body.body,
    date: req.body.date,
  };
  const sql = "INSERT INTO article (title, body, date) VALUES (?,?,?)";
  const params = [data.title, data.body, data.date];
  db.run(sql, params, function (err, result) {
    //Can be improved: (Applicable to all endpoints too) Use the try..catch stament to handle errors. This way, we can have more control over the error and return a more descriptive message to the client. You can find more information about try..catch here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
    if (err) {
      res.status(403).json({ error: err.message });
      return;
    }
    res.json({
      message: "Success",
      data: data,
      id: this.lastID,
    });
  });
});

router.put("/api/article/:id", (req, res, next) => {
  const data = {
    title: req.body.title,
    body: req.body.body,
  };
  // Can be improved: Before submitting work, please make sure that all lines of code containing debugger and console.log are deleted.
  console.log(data);
  db.run(
    `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
    [data.title, data.body, req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        // Needs correction: (Applicable to all endpoints too) It's very important to use status codes in our APIs, as each code represents something different. When returning a code to represent an error, we should choose one that accurately describes the error. You can find all the error codes and their meanings here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        res.status(403).json({ error: res.message });
        return;
      }
      res.json({
        message: "Success",
        data: data,
      });
    }
  );
});

router.delete("/api/article/:id", (req, res, next) => {
  db.run(
    "DELETE FROM article WHERE id = ?",
    req.params.id,
    function (err, result) {
      if (err) {
        // Needs correction: (Applicable to all endpoints too) When we are returning an error, the message should be clear and descriptive. That's why it's important to use the error message that comes from the error object. This way, the client can understand what happened and act accordingly. You can find more information about error objects here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
        res.status(403).json({ error: res.message });
        return;
      }
      res.json({ message: "Deleted", rows: this.changes });
    }
  );
});

router.get("/", (req, res, next) => {
  res.json({ message: "Ok" });
});

module.exports = router;
