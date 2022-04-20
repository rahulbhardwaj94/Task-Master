const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose, MongooseError } = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

mongoose.connect("mongodb+srv://admin-rahul:mongodb%40549@cluster0.5o0vp.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

// Schema
const itemsSchema = {
  name: String,
};

// List Schema
const listSchema = {
  name: String,
  items: [itemsSchema]
}


// Model
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);


// New Mongoose Document
const item1 = new Item({
  name: "Welcome to the To-Do List..!!",
});

const item2 = new Item({
  name: "Hit the '+' button to add a new item to the list",
});

const item3 = new Item({
  name: "Hit <--- to delete the item",
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (err) => {
//   if (!err) {
//     console.log("Successfully saved to DB");
//   } else {
//     console.log(err);
//   }
// });

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (!err) {
          console.log("Successfully saved to DB");
         } else {
          console.log(err);
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", { listTitle: "Task-Master", newListItem: foundItems });  
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  
  // Mongoose New Document
  const item = new Item({
    name: itemName
  });

  if(listName === "Task-Master"){
    item.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName}, (err,foundList)=>{
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

});

app.post("/delete", (req, res) => {
  const checkedItemId =  req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Task-Master"){
    Item.findByIdAndRemove(checkedItemId, (err)=>{
      if(!err){
        console.log("Deleted one entry from database");
        res.redirect("/");
      }
    });
  }
  else{
    List.findOneAndUpdate(
      {name: listName},
      {$pull: {items: {_id: checkedItemId}}},
      (err, foundList)=>{
        if(!err){
          res.redirect("/" + listName);
        }
      }
    )
  }

  
});




// Custom List

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name:customListName}, (err, foundList)=>{
    if(!err){
      if(!foundList){
        // console.log("Doesn't Exist");
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName)
      }
      else{
        // console.log("Exists");
        // Show an existing list
        res.render("list",{
          listTitle: foundList.name,
          newListItem:foundList.items
        });
      }
    }
  })
});

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
