const mongoose  = require('mongoose');
const Schema  =  mongoose.Schema;

const articleSchema = new Schema({
     owner: {
         type :Schema.Types.ObjectId,
         ref: 'user',
         ref1:'admin',
         require:true
     },
     
     image:String,
    title : {
        type: String,
        require:true,
    },
    content:{
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
    },
    //new code
    // comments: {type: mongoose.Schema.Types.ObjectId}
})

module.exports = mongoose.model('article', articleSchema);
