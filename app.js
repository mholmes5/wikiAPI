const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

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
        res.status(201);
        res.send("Article successfully added");
      }else{
        res.send(err);
      }
    });
  })
  .delete((req, res)=>{

    Article.deleteMany({},(err)=>{
      if(!err){
        res.status(200);
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
          res.status(200);
          res.send(foundArticle);
        }else{
          res.status(404);
          res.send("No article with title " +req.params.articleTitle +" was found.");
        }
      }else{
        res.send(err);
      }
    })
  })
  .put((req,res)=>{
    Article.updateOne(
      {title:req.params.articleTitle},
      {title:req.body.title, content:req.body.content},

      function(err, updatedArticle){
        if(!err){
          if(updatedArticle.n === updatedArticle.nModified && updatedArticle.n === 1){
            res.status(200);
            res.send("Article Updated");
          }else{
            res.status(404);
            res.send("Article not updated");
          }
        }else{
          res.status(500);
          res.send(err);
        }
      }
    )
  })
  .patch((req,res)=>{
    Article.updateOne(
      {title:req.params.articleTitle},
      req.body,

      function(err, updatedArticle){
        if(!err){
          if(updatedArticle.n === updatedArticle.nModified && updatedArticle.n === 1){
            res.status(200);
            res.send("Article Updated");
          }else{
            res.status(404);
            res.send("Article not updated");
          }
        }else{
          res.status(500);
          res.send(err);
        }
      }
    )
  })
  .delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err, deletion)=>{
      if(!err){
        if(deletion.n === deletion.deletedCount && deletion.n ===1){
          res.status(200);
          res.send(req.params.articleTitle +" Article successfully deleted");
        }else{
          res.status(404);
          res.send(req.params.articleTitle +" Article does not exist");
        }

      }else{

        res.send(err);
      }
    })
  });

app.listen(3000, function(){
  console.log("Server started on port 3000");
})
