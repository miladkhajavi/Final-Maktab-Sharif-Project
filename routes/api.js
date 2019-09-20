var express = require('express');
var router = express.Router();
let User = require('../model/user')
let Article = require('../model/article')
const multer = require('multer');
const path = require('path');
let ac = require('../tools/ac');
// const bcrypt = require('bcryptjs');
const passport = require('passport');
const auth = require('../tools/auth');
const admin = require('./admin');
const user = require('./user');
// const flash = require('connect-flash');
let Comment = require('../model/comment')

//upload
  // Set The Storage Engine
  const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
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




// initialize
router.put('/addAdmin', (req, res) => {
  User.findOne({role: 'admin'}, (err, existAdmin) => {
    if (err) return res.json({success: false, msg: 'error'});
    if (existAdmin) return res.status(404).send('NOT FOUND');

    new User({
      firstName: "milad",
      lastName: "khajavi",
      username:"miladkhajavi",
      email:"mkhajavi5@gmail.com",
      gender:"man",
      password: "12345678",
      role: 'admin',
      mobile: "09226334927",
      avatar:"avatar.jpg"
    }).save((err, user) => {
      if (err) return res.json({success: false, msg: 'error'});

      return res.json({success: true, user})
    })

  })
})
// register users
router.get('/register', function(req, res) {
  res.render('register', {msg: "hello"});
});

router.post('/register',upload.single('avatar'), (req,res,err)=>{
  
  console.log(req.body)
  // res.send('hi!!')
  let {firstName,lastName ,username, email,gender,mobile,password,password2, role}=req.body
  
//check required fields
  if (!firstName || !lastName || !username ||!email ||!gender ||!mobile || !password ||!password2) {
    res.render('register',{ msg: 'Please enter all fields' });
  }
//check password
  if (password != password2) {
    res.render('register',{ msg: 'Passwords do not match' });
  }
//check password length
  if (password.length < 6) {
    res.render('register',{ msg: 'Password must be at least 6 characters' });
  }
  if (password.length > 29) {
    res.render('register', {
      errors,
      firstName,
      lastName,
      username,
      email,
      gender,
      mobile,
      password,
      password2
    });
  }
  //validation passed
  else {
    User.findOne( { username: username}).then(user => {
      if (user) {
      
        res.render('register', { msg: 'Username already exists',
          errors,
          firstName,
          lastName,
          username,
          email,
          gender,
          mobile,
          password,
          password2
        });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          username,
          email,
          gender,
          mobile,
          password,
          role:"user",
          avatar: "avatar.jpg",
        });
        // console.log(newUser);
        // res.send('test')
        // bcrypt.genSalt(10, (err, salt) => {
        //   bcrypt.hash(newUser.password, salt, (err, hash) => {
        //     if (err) throw err;
        //     newUser.password=hash;
            newUser
              .save()
              .then(user => {
               
                res.render('login' , {msg:"successfully register..now you can login in your profile"});
              })
              .catch(err => console.log(err));
        //   })
        // });
      }
    });
  }
});


/////////
// get login page
router.get('/login', function(req, res, next) {
  res.render('login', {msg: "welcome"});
});


router.get('/panel' ,(req, res , html)=>{
  
  if (req.user.role === 'user') return res.render('userPanel', {title: 'user panel', user: req.user,articles:req.article})
  else {User.find({role:'user'},{password:0},(err, golabi) => {if (!err) {res.render('adminPanel', { user:req.user,table: golabi});} else {
  console.log('Error in  retrieving employee list :' + err)
}
})
}

})
//authentication
router.post('/panel', passport.authenticate('local'), async (req, res, next) => {


  if (req.user.role === 'user') return res.render('userPanel', {title: 'user panel', user: req.user ,articles:req.article})
  else {
    User.find({role:'user'},{password:0},(err, golabi) => {
      if (!err) {
        res.render('adminPanel', {
       
      user:req.user,
      table: golabi,
    
  });
  } else {
    console.log('Error in  retrieving employee list :' + err)
  }
  }) 
  }
});


router.use('/admin', auth.isLogin, ac.routeController(['admin', 'user']), admin);
router.use('/user', auth.isLogin, ac.routeController(['user']), user);










//get single article
router.get('/allArticles/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.owner, function(err, user){
     Comment.findById(req.params.id , function(err , comment){
      res.render('singleArticle', {
        article:article,
        owner: user.firstName,
        ownerlast:user.lastName,
        comment:comment,
        // artic: comment.artic
      
      });
    })
    });
  });
});


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
router.post('/ArticleEdit/:id', function(req, res){
  var article = {
    title: req.body.title,
    content: req.body.content,
    
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

// all user article
router.get('/allArticles', function(req, res, next) {
  Article.find({},{__v:0}).populate('owner',{firstName:1,lastName:1,_id:0}).sort({lastUpdate: -1}).exec((err,articles)=>{
    if(err) return res.status(500).send('something went wrong ')
   return res.render('articles', {articles:articles ,user:req.user})
    // return res.json({articles})
    
})
})


/////////////////////comment-delete////////////////
router.delete('/commentDelete/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let ID = {_id:req.params.id}

  Comment.findById(req.params.id, function(err, comments){
   
      Comment.remove(ID, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    
  });
});


// router.get('/getComments', (req, res)=>{
// //  owner : req.user._id 
//   Article.find({owner : req.user._id},{_id:1}).sort({lastUpdate: -1}).exec((err,articles)=>{
   
//   Comment.find({},{__v:0}).populate('userID',{firstName:1,username:1,_id:0}).populate('artic',{_id:1,title:1}).sort({lastUpdate: -1}).exec((err,comment)=>{
//       if(err) return res.status(500).send('something went wrong ')
//       // res.render('singleArticle', {title:"all comments" ,comment:req.comment ,user:req.user}) 
      
//       return res.json({comment , articles })
      
//     })
//   })
// })


router.post('/addComment' , (req,res)=>{
 
    let { comment ,artic  }=req.body;
   
  if(!comment){
    return res.status(400).send({msg:'empty fields'})
  }
  
  const NEW_Comment = new Comment({
    comment,
    artic,
    userID:req.user,
  
   
    
  })

  NEW_Comment.save((err , comment)=>{
    if (err) res.status(500).send('something went wrong')
    // return res.render('singleArticle',{comment, article:req.article , msg :"successfully added"})
    // return res.json({comment})
    let tag = "/api/"+req.user.role+"/allArticles/"+artic
    res.redirect(tag)
  })
  


})





 







// // handel logout


// router.get('/logout', (req,res)=>{
//   req.logout();
//   res.redirect('./login')
  
//   // res.render('login',{msg:'successfully logout'})
// });

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('./login')
      }
    });
  }
});

module.exports = router;
