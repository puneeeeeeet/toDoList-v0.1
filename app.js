const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose =require("mongoose");
const path = require("path");
const { isBuffer } = require("util");
const _ = require("lodash");

// var items = ["Wake-up"];

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://Puneeeeeeet:Test123@cluster0.wmg3bpl.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Welcome to your to-do-list"
});

const item2 = new Item({
    name:"add work and hit + button"
});

const item3 = new Item({
    name: "tick the checkBox to cut"
});
const defaultItems = [item1,item2,item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List",listSchema);  

app.get("/",function(req,res){
//     var today = new Date();
//     var options = {
//         weekday: "long",
//         day:"numeric",
//         month:"long",
//     };
// var day = today.toLocaleDateString("en-US",options);
    Item.find({},function(err, foundItems){

        if(foundItems.length ===0){
            Item.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("SuccessFully added items in DB")
                }
                res.redirect("/");
            });
        }else{
            res.render("list",{typeOfDay: "Today",newListItems: foundItems});
        }
    })
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName)
            }else{
                res.render("list",{typeOfDay:foundList.name,newListItems: foundList.items})
            }
        }
    })
});

    app.post("/",function(req,res){
        const itemName = req.body.newItem;
        const listName = req.body.list;
        const item = new Item({
            name: itemName
        })
        if(listName === "Today"){
            item.save();
            res.redirect("/");
        }else{
            List.findOne({name: listName},function(err, foundList){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+ listName)

            })
        }
    });
    
    app.post("/delete",function(req,res){
        const checkedItemID = req.body.checkbox;
        const listName = req.body.listName;
        if(listName=== "Today"){
            Item.findByIdAndRemove(checkedItemID,function(err){
                if(!err){
                    console.log("Successfully  deleted checked Items")
                    res.redirect("/")
                }
            });
            }else{
                List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemID}}}, function(err, foundList){
                if(!err){
                    res.redirect("/"+listName);
                }
                })
            }
       
    });

  

app.listen(process.env.PORT || 3000,function(){
    console.log("Working on port 3000.")
});
