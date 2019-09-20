const mongoose  = require('mongoose');
const Schema  =  mongoose.Schema;

const commentSchema = new Schema({
    
     userID: {
        type :Schema.Types.ObjectId,
        ref: 'user',
        ref1:'admin',
        require:true
    },
    // new code 
    artic :{
        type:Schema.Types.ObjectId,
        ref:'article'
    },
   
    comment:{
        type:String,
         require:true
    },
    createAt : {
        type:Date,
        require:true,
        default:Date.now
    },
    lastUpdate: {
        type: Date, 
        require:true,
        default:Date.now
    }
})

module.exports = mongoose.model('comment', commentSchema);
