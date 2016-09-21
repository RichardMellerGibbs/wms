//---------------------------------------------------------------------
// NEWS MODEL
//---------------------------------------------------------------------

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsSchema = new Schema({
    title: {type: String},
    articleDate: {type: Date, required: true},
    snippet: {type: String},
    description: {type: String, required: true}
});

module.exports.News = mongoose.model('News',NewsSchema);