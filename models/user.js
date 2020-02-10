const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

// 1) Define our model
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String
})

// 4) (way later after installing bcryptjs) >> On Save Hook, encrypt password (using bcrypt)
// Before saving a model, run this function
userSchema.pre('save', function (next) {
    // Get access to User model
    const user = this

    // Generate a 'salt', then run callback
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return next(err) }

        // Hash (encrypt) our password using the salt 
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) { return next(err) }

            // Overwrite plain text password with encrypted password
            user.password = hash

            // Save the model
            next()
        })
    })
})

// 5) 
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) { // compare 'stored password' (this.password) vs. encrypted 'candidatePasword'
        if (err) { return callback(err) }
        callback(null, isMatch)
    })
}

// 2) Create the model class (to create new users)
const ModelClass = mongoose.model('user', userSchema)

// 3) Export the model
module.exports = ModelClass