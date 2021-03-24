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

/////// Requests targeting all articles ///////

app.route("/articles")

  .get(function(req,res){

    Article.find({},function(err, articles){
      if(!err){
        res.send(articles);
      }else{
        res.send(err);
      }
    });
  })
  .post(function(req,res){

    const article = new Article ({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function(err){
      if(!err){
        res.send("Article successfully added");
      }else{
        res.send(err);
      }
    });
  })
  .delete((req, res)=>{

    Article.deleteMany({},(err)=>{
      if(!err){
        res.send("All Articles successfully deleted");
      }else{
        res.send(err);
      }
    });
  });


/////// Requests targeting single article ///////

app.route("/articles/:articleTitle")

  .get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err, foundArticle)=>{
      if(!err){
        if(foundArticle){
          res.send(foundArticle);
        }else{
          res.send("No article with title " +req.params.articleTitle +" was found.");  
        }
      }else{
        res.send(err);
      }
    })
  });

app.listen(3000, function(){
  console.log("Server started on port 3000");
})
