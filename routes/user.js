var express = require('express');
var router = express.Router();
let User = require('../model/user')
let Article = require('../model/article')
let generalTools = require('../tools/general-tools');
const passport = require('passport');
const auth = require('../tools/auth');
const multer = require('multer');
const path = require('path');
var fs = require('fs');
let Comment = require('../model/comment')

// multer


///////////////////////////////////////////////////////////////////////////multer///////////////////////////////////////////
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 100000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
})

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}    

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.get('/test', (req, res) => {
    return res.json({msg: 'hello from user route'})
});

/// ////////////////////////////////////////////////////////add article /////////////////////////////////////////////
router.get('/addArticle', function(req, res) {
  res.render('addArticle', {msg: "user article Adder"});
});
router.post('/addArticle' ,upload.single('image'), (req , res)=>{
  let {title , content }=req.body;
  if(!title||!content){
    return res.status(400).send({msg:'empty fields'})
  }
  const NEW_ARTICLE = new Article({
    title,
    content,
    image: req.file.filename,
    owner:req.user._id

  })
  NEW_ARTICLE.save((err , article)=>{
    if (err) res.status(500).send('something went wrong')
    return res.render('addArticle',{article , msg :"successfully added"})
  })
 
})
/////////////////////////////////////////////////////////// get all my article ///////////////////////////////////////
router.get('/allArticles', (req, res)=>{
  Article.find({owner : req.user._id},{__v:0}).populate('owner',{firstName:1,lastName:1,_id:0}).sort({lastUpdate: -1}).exec((err,articles)=>{
      if(err) return res.status(500).send('something went wrong ')
      res.render('articles', {title:"all articles" ,articles:articles ,user:req.user})
      // return res.json({articles})
      
  })
})
router.get('/allArticles/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.owner, function(err, user){
      Comment.find({artic:article._id}).populate('userID',{firstName:1,username:1,_id:0}).populate('artic',{_id:1,title:1}).sort({lastUpdate: -1}).exec((err,comment)=>{
      res.render('singleArticle', {
        article:article,
        owner: user.firstName,
        ownerlast:user.lastName,
        table:comment
      })
      });
    });
  });
});


////////////////////////////////////////////////////////////////////// Delete Article////////////////////////////////
router.delete('/deleteArticle/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let ID = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
   
      Article.remove(ID, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    
  });
});




///////////////////////////////////////////////////////////// Load Edit Form Article//////////////////////////
router.get('/ArticleEdit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title:'Edit Article',
      article:article,
      msg:"Welcome , if you want edit your article do it ,else return to all articles"
    });
  });
});

// //////////////////////////////////////////////////////Update Submit POST Route//////////////////////////////
router.post('/ArticleEdit/:id',upload.single('image'), function(req, res){
  var article = {
    title: req.body.title,
    content: req.body.content,
    image: req.file.filename,
    lastUpdate: Date.now()
    
  }

  let ID = {_id:req.params.id}

  Article.findByIdAndUpdate(ID, article, function(err , article){
    if(err){
      console.log(err);
      return;
    } else {
      
      res.render('edit_article', {
        title:'Edit Article',
        msg:"success edit",
        article:article
      });
    }
  });
});



/////////////////////////////////////////////////////delete aCCount user//////////////////////////////////////////////
router.get('/delete/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.render('login',{msg:'delete Account successfully .bye bye'});
        }
        else { console.log('Error in User delete :' + err); }
    });
  });



   /////////////////////////////////////////////////// edit or update user  information///////////////////////
   router.get('/edit/:id' , (req,res)=>{
    console.log(req.params.id);
    User.findById(req.params.id , (err, user)=>{
      if(err){
        console.log(err);
        
      }else{
        console.log(user);
        res.render('edit-user', {user , title:' User Update panel',msg:null});
        
      }
    })
    
  })
  
  router.post('/edit/:id',(req, res) => {
    var mybodydata = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username:req.body.username,
      gender:req.body.gender,
      password:req.body.password,
      lastUpdate: Date.now()
      
    }
  
    User.findByIdAndUpdate(req.params.id , mybodydata , function(err , user) {
      
      if(err){
        res.redirect('edit/'+req.params.id)
      }else{
        res.render('edit-user', {user ,title:' User Update panel', msg:'changes successfully'})
      }
    
  });
   
  });

 




//////////////////////////////////////////////////// upload avatar profile///////////////////////////////////
 //
 router.get('/upload/:id' , (req,res)=>{
  console.log(req.params.id);
  User.findById(req.params.id , (err, user)=>{
    if(err){
      console.log(err);
      
    }else{
      console.log(user);
      res.render('uploadimage', {user , title:' upload avatar',msg:null});
      
    }
  })
  
})

router.post('/upload/:id',upload.single('avatar'),(req, res) => {
  var myAvatar = {
    avatar: req.file.filename,
    lastUpdate: Date.now() 
  }

  User.findByIdAndUpdate(req.params.id , myAvatar , function(err , user) {
    
    if(err){
      res.redirect('upload/'+req.params.id)
    }else{
      res.render('uploadimage', {user ,title:'upload avatar', msg:'Upload successfully'})
    }
  
});
 
});

/////////////////////////////////////////////////////////////////////////////////////
///comment//
// router.get('/addComment' , (req,res)=>{
//   return res.json({comment})
//   // return res.render('singleArticle',{comment,article:req.article , msg :"successfully added"})
// })






module.exports = router;
