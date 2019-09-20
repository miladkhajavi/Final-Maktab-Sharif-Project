const passport = require('passport');
const Localstrategy = require('passport-local');
const User = require('../model/user')
passport.use('local', new Localstrategy({usernameField:"username", passwordField:"password"}, async (username, password, done) => {
    try {
        let user = await User.find({
            username,
            password
        });
        
        if (user.length != 1 && !user) {
            return done(null, false, {msg:"user not found"})
        }
        return done(null, user[0])
    } catch (err) {
        throw err
    }
}));





// User.findOne({mobile , password}).then(user=>{
//     if (!user) {
//         return done(null,false,{message:"username is not register"})
//     }
//   // mach password
//   bcrypt.compare(password,user.password,(err,match)=>{
//       if(err) throw err;
//       if(match){
//           return done(null,user)
//       }else{
//           return done(null,false,{message:"pass incorrect ast ;) ha ha ha"})
//       }
//   })
// }) 
// .catch(err=> console.log(err));
// })




passport.serializeUser((user, done) => {
    done(null, user.id)
});
passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    })
});
module.exports = {
    isLogin: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        throw {
            status: 403,
            message: "You're not logged in. Access denied."
        }
    }
};