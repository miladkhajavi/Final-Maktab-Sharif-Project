var express = require('express');
var router = express.Router();
let User = require('../model/user')
let Article = require('../model/article')
let generalTools = require('../tools/general-tools');
const passport = require('passport');
const auth = require('../tools/auth');
let Comment = require('../model/comment')
const multer = require('multer');
const path = require('path');


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







//////////////////////
router.get('/adminData', (req, res) => {
  
  User.find({role:"admin"}, (err, users) => {
    if (err) return res.json({success: false, msg: 'can not get data'})
    
    return res.json({success: true, users});
  })
})

// // show all users
// router.get('/getAllUsers', (req, res) => {
  
//   User.find({role:"user"},{password:0}, (err, users) => {
//     if (err)  console.log('Error in  retrieving employee list :' + err)
//     return res.render('adminPanel',{user:req.user,users:users})
//     // return res.json({success: true, users});
//   })
// })


// Delete Article
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

///edit articles
// Load Edit Form
router.get('/ArticleEdit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      title:'Edit Article',
      article:article,
      
      msg:"Welcome , if you want edit your article do it ,else return to all articles"
    });
  });
});

// Update Submit POST Route
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




// show articles
router.get('/allArticles', function(req, res, next) {
  Article.find({},{__v:0}).populate('owner',{firstName:1,lastName:1,_id:0}).sort({lastUpdate: -1}).exec((err,articles)=>{
    if(err) return res.status(500).send('something went wrong ')
   return res.render('articles', {articles:articles ,user:req.user})
    // return res.json({articles})
    
})
});
//get single article
router.get('/allArticles/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.owner, function(err, user){
      Comment.find({artic:article._id}).populate('userID',{firstName:1,username:1,_id:0}).populate('artic',{_id:1,title:1}).sort({lastUpdate: -1}).exec((err,comment)=>{
           res.render('singleArticle', {
        article:article,
        owner: user.firstName,
        ownerlast:user.lastName,
        table:comment
      });
      })  
    });
  });
});

/// add article ///
router.get('/addArticle', function(req, res) {
  res.render('addArticleAdmin', {msg: "admin article Adder"});
});
router.post('/addArticle' ,upload.single('image'), (req , res)=>{
  let {title , content  }=req.body;
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
    return res.render('addArticleAdmin',{article , msg :"successfully added"})
  })
 
})


// edit Admin //
// edit or update Admin  information
router.get('/edit/:id' , (req,res)=>{
  console.log(req.params.id);
  User.findById(req.params.id , (err, user)=>{
    if(err){
      console.log(err);
      
    }else{
      console.log(user);
      res.render('edit-user', {user ,title:' Admin Update panel',msg:null});
      
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
      res.render('edit-user', {user ,title:' Admin Update panel', msg:'changes successfully'})
    }
  
});
 
});


// ///// delete users
router.delete('/deleteUsers/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let ID = {_id:req.params.id}

  User.findById(req.params.id, function(err, user){
   
      User.remove(ID, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    
  });
});
/////////////////////////////////////////////////// upload avatar profile///////////////////////////////////
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

//-----------------RECOVERY PASSWORD USERS-------------------------------------------------------------------------------------------------

router.put('/recoveryPass/:id', (req, res, next) => {
  let id = req.params.id
  User.findById(req.params.id , (err, user) => {
      User.findByIdAndUpdate(id ,{$set :
        {password:user.mobile}
      } ,(err)=>{
        if(!err){
          console.log("recovery is success");
          res.send("recovery password is successful")
        }
      })
  });
});








module.exports = router;
