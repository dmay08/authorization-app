const passport = require('passport')
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')


// 2 Strategies for authorization:
    // 1) Local Strategy > verifies Email/Password
    // 2) JWT Strategy > verifies user Token (for access to restricted areas)

// Create Local Strategy === SIGN-IN >> VERIFY EMAIL/PASSWORD >> give token
const localLogin = new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
    // Verify the email and password, call 'done'' with the user (if it's correct email and password)
    // Otherwise, call 'done' with FALSE
    User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err) }
        if (!user) { return done(null, false) }

        // Compare passwords - is 'password' equal to 'user.password'?
        // (compare ENCRYPTED PASSWORD to actual passsword)
        user.comparePassword(password, function (err, isMatch) {
            if (err) { return done(err) }
            if (!isMatch) { return done(null, false) }

            return done(null, user)

        })
    })
})

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

// Create JWT Strategy === AUTHORIZED REQUEST >> verify TOKEN >> allow user access to request
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // See if the user ID in the payload exists inr our database
    // If it does, call 'done' with that user
    // Otherwise, call 'done' WITHOUT a user object
    User.findById(payload.sub, function (err, user) {
        if (err) { return done(err, false) }

        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)