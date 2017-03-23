//---------------------------------------------------------------------
// USER MODEL
//---------------------------------------------------------------------

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	//name: { type: String, required: true },
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    mobile: { type: String },
    office: { type: String },
    customer: { type:Boolean, required: true },
    username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false },
	admin: { type:Boolean, required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

//Hash the password before saving
UserSchema.pre('save', function(next) {
    var user = this;
    
    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();
    
    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
    
        if (err) return next(err);
        
        // change the password to the hashed version
        user.password = hash;
        next();
    }); 
});


// Method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {

    var user = this;
    return bcrypt.compareSync(password, user.password);
};

module.exports.User = mongoose.model('User',UserSchema);