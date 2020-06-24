//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")
 
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express(); 

app.set('view engine', 'ejs');
const postsArray = [];
 

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mogoose connect
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true ,  useUnifiedTopology: true})


//mongoose schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
//mongoose model
const Article = mongoose.model("Article", articleSchema)

//HOME
app.get("/", function(req,res){

  //use res.render to call ejs
  Article.find(function(err, articles){
    if(err){
      console.log(err)
    }else{

      res.render('home', {homeContent: homeStartingContent,toPostHome: articles })
    }
  })
   
})

//ABOUT
app.get("/about", function(req,res){

  //use res.render to call ejs
   res.render('about', {aboutContent: aboutContent})
})

//Contact
app.get("/contact", function(req,res){

  //use res.render to call ejs
   res.render('contact', {contactContent: contactContent})
})

//Compose
app.get("/compose", function(req,res){

  //use res.render to call ejs
   res.render('compose', {contactContent: contactContent})


})


app.get("/post/:test",function(req,res){

  Article.find(function(err, articles){
    if(err){
      console.log(err)
    }else{
      
  let requestParams =_.lowerCase(req.params.test) ;
  console.log( _.lowerCase(requestParams))
  
      articles.forEach(function(eachArticles){
        // console.log(eachArticles.title)
  
        let storedTitle = _.lowerCase(eachArticles.title);
        let hrefURl = requestParams + "/"+storedTitle;
        console.log(eachArticles.content)
  
        if(requestParams === storedTitle ){
          console.log("matched")
       
          res.render("post", {titleToPost: eachArticles.title, contentToPost: eachArticles.content})
       
        }
      })
    
    }
  })
  
// postsArray.forEach(function(eachPostArray){

//   let storedTitle = _.lowerCase(eachPostArray.objectTitle);
//   let hrefURl = requestParams + "/"+storedTitle;
//   console.log(hrefURl)
//    if(requestParams === storedTitle ){
//     console.log("matched")
 
//     res.render("post", {titleToPost: eachPostArray.objectTitle, contentToPost: eachPostArray.objectPost})
 
//   }
//  })

 
 });

app.post("/compose",function(req,res){
 
  const title = req.body.title;
  const inputItem= req.body.inputCompose;

  const  composeContainter = new Article({
    title:title,
    content:inputItem
 })



  const post = {

    objectTitle:title,
    objectPost:inputItem
  }

  composeContainter.save();
  postsArray.push(post);
  console.log(postsArray)
  res.redirect("/");

});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
