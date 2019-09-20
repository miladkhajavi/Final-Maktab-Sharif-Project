var express = require('express');
var router = express.Router();
let User = require('../model/user')
let Article = require('../model/article')
/* GET home page. */
//get all public articles
router.get('/', function(req, res, next) {
  Article.find({},{__v:0}).populate('owner',{firstName:1,lastName:1,_id:0}).sort({lastUpdate: -1}).exec((err,articles)=>{
    if(err) return res.status(500).send('something went wrong ')
   
    res.render('panel', {title:"all articles" ,articles:articles ,user:req.user})
    // return res.json({articles})
    
})
});
// get single page 
router.get('/publicArticle/:id', function(req, res){
  Article.findById(req.params.id, function(err, articles){
    User.findById(articles.owner, function(err, user){
      // res.render('panel', {
      //   articles:articles,
      //   owner: user.firstName,
      //   ownerlast:user.lastName
        
      // });
      return res.json({articles , user})
    });
  });
});
module.exports = router;
