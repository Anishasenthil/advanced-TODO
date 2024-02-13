import express from "express";      // weekitems  => table name - week TODO
import bodyParser from "body-parser";  // items => table name - month  TODO
import pg from "pg";                    // todayitems => table name - today  TODO

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "universe",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async(req, res) => {
  const result = await db.query("SELECT * FROM todayitems");
  let todayitems = result.rows;
  res.render("index.ejs",{
    listTitle : "TODAY",
    listItems: todayitems,
  });
});


app.post("/", (req, res) => {
  // Placeholder route handler or redirect to another page
  res.redirect("/"); // You can redirect to the same page or another page as needed
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  const prio = req.body.priority;
  await db.query("INSERT INTO todayitems(title,priority) VALUES($1,$2)",[item,prio]);

  res.redirect("/");

});

app.post("/edit",async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  await db.query("UPDATE todayitems SET title = ($1) WHERE id = $2", [item, id]);
  res.redirect("/");
});

app.post("/delete",async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM todayitems WHERE id = $1",[id]);
  res.redirect("/");
});


let items = [
  { id: 1, title: "Buy milk" , priority : "high",dueDate : "2024-01-31" },
  { id: 2, title: "Finish homework",priority : "low",dueDate : "2024-02-05" },];

// monthly todo
app.get("/month", async(req, res) => {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
  res.render("month.ejs", {
    listTitle: "This month",
    listItems: items,
  })
});

app.post("/month", async(req, res) => {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
  res.render("month.ejs", {
    listTitle: "This month",
    listItems: items,
  })
});

app.post("/addMonth",async (req, res) => {
  const item = req.body.newItem;
  const prio = req.body.priority;
  const date = req.body.dueDate;
  await db.query("INSERT INTO items(title,priority,duedate) VALUES($1,$2,$3)",[item,prio,date]);

  res.redirect("/month");

});

app.post("/editMonth",async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
  res.redirect("/month");
});

app.post("/deleteMonth",async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1",[id]);
  res.redirect("/month");
});


app.post("/month", async (req, res) => {    // inside month weekly-todo button
  if (req.body.week === "Monthly-Todo") {
    res.redirect("/month");
  } else {
    res.redirect("/");
  }
});



// weekly todo
app.get("/week", async (req, res) => {
  const result = await db.query("SELECT * FROM weekitems");
  let weekitems = result.rows;
  res.render("week.ejs", {
    listTitle: "This  Week",
    listItems: weekitems,
  });
});

app.post("/week", async (req, res) => {    // inside month weekly-todo button
  if (req.body.week === "Weekly-Todo") {
    res.redirect("/week");
  } else {
    res.redirect("/");
  }
});

app.post("/addWeek",async (req, res) => {
  const item = req.body.newItem;
  const prio = req.body.priority;
  const date = req.body.dueDate;
  await db.query("INSERT INTO weekitems(title,priority,duedate) VALUES($1,$2,$3)",[item,prio,date]);

  res.redirect("/week");

});

app.post("/editWeek",async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  await db.query("UPDATE weekitems SET title = ($1) WHERE id = $2", [item, id]);
  res.redirect("/week");
});

app.post("/deleteWeek",async (req, res) => {
  const id = req.body.deleteItemId;
  await db.query("DELETE FROM weekitems WHERE id = $1",[id]);
  res.redirect("/week");
});

app.post("/month", async (req, res) => {  // inside week monthly todo button
  if (req.body.month === "Monthly-Todo") {
    res.render("month.ejs");
  } else {
    res.redirect("/");
  }
});

// port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
