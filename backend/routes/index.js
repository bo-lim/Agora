const express = require('express');
const bodyParser = require('body-parser');
const User = require('./users')

const router = express.Router();
router.use(bodyParser.json());

// Handles GET requests to /user
router.post('/signin',(req,res) => {
    console.log(`user collections`)
    try {
        User.create(({name: req.body.name, password: req.body.password}))
        res.status(200).send()
    } catch (err) {
        if (err.name == "ValidationError") {
            console.error('validation error: ' + err)
            res.status(400).json(err)
        } else {
            console.error('could not save: ' + err)
            res.status(500).json(err)
        }
    }

})

module.exports = router;
