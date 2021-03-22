const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const url = "mongodb://localhost:27017/wikiDB";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.get("/articles",function(req,res){

    Article.find({},function(err, articles){
      if(!err){
        res.send(articles);
      }else{
        res.send(err);
      }
    });
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
})
