const User = require('../models/user')

exports.signup = function(req, res, next) {
    // res.send({ success: 'true' }) // tested with this first (sent POST in postman to localhost:3090/signup >> didn't send anything >> got RESPONSE 'success: true' on page)
    // console.log(req.body) // tested with this second (sent POST (in postman) to localhost:3090/signup >> sent JSON object: {"email": "example@gmail.com", "password": "abc" }) 

    const email = req.body.email
    const password = req.body.password

    // See if a user with the given email exists
    User.findOne({ email: email }, function(err, existingUser) {
        if (err) { return next(err) }

        // If a user with email DOES exist, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is in use' }) // 422 === unprocessable entity 
        }

        // If a user with email does NOT exist, CREATE user record
        const user = new User({
            email: email,
            password: password
        })

        // Then > SAVE the user record 
        user.save(function(err) {
            if (err) { return next(err) }
        })

        // Respond to request indicating the user was created
        res.json(user)
    })



}