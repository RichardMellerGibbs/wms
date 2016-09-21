//---------------------------------------------------------------------
// CONTENT MODEL
//---------------------------------------------------------------------

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/*var ContentSchema = new Schema({
	itemType: {type: String, required: true},
    internalDesc: {type: String, required: true},
    itemDate: {type: Date, required: true},
    description: {type: String, required: true},
    title: {type: String, required: true}
});*/

var ContentSchema = new Schema({
	subject: {type: String, required: true},
    title: {type: String},
    description: {type: String}
});

module.exports.Content = mongoose.model('Content',ContentSchema);