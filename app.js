const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

var items = ["Wake-up"];

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
    var today = new Date();

    var options = {
        weekday: "long",
        day:"numeric",
        month:"long",
    };
var day = today.toLocaleDateString("en-US",options);
    res.render("list",{typeOfDay: day,newListItems: items});
});

    app.post("/",function(req,res){
        var item = req.body.itemName;
        items.push(item); 
        res.redirect("/");  

    });
    // app.get("/work")

app.listen(process.env.PORT || 3000,function(){
    console.log("Working on port 3000.")
});