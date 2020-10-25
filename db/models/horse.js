//---------------------------------------------------------------------
// HORSE MODEL
//---------------------------------------------------------------------

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var HorseSchema = new Schema({
  title: { type: String },
  lot: { type: String },
  articleDate: { type: Date },
  type: { type: String },
  color: { type: String },
  line2: { type: String },
  line3: { type: String },
  picture: { type: Schema.Types.Mixed },
  videolocation: { type: String },
  documentlocation: { type: String },
  articleUrl: String,
  description: { type: String },
  articleUrlDescription: String,
});

module.exports.Horse = mongoose.model('Horse', HorseSchema);
