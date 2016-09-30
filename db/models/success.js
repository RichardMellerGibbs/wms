//---------------------------------------------------------------------
// SUCCESS MODEL
//---------------------------------------------------------------------

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SuccessSchema = new Schema({
    type: {type: String, required: true},
    title: {type: String},
    articleDate: {type: Date},
    description: {type: String, required: true},
    by: {type: String},
    picture: {type: Schema.Types.Mixed},
    createdAt: {type: Date, default: Date.now},
    articleUrl: String,
    articleUrlDescription: String
});

// Sets the createdAt parameter equal to the current time
SuccessSchema.pre('save', function(next){
    now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});

module.exports.Success = mongoose.model('Success',SuccessSchema);