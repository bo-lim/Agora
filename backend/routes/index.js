const express = require('express');
const bodyParser = require('body-parser');
const User = require('./users')
const Discussion = require('./discussions')

const router = express.Router();
router.use(bodyParser.json());

// user
router.post('/signup',(req,res) => {
    console.log(`user collections`)
    try {
        User.create(({user_id: req.body.user_id, password: req.body.password}))
        res.status(201).send()
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


// discussion
router.post('/discussion',(req,res) => {
    console.log(`discussion collections`)
    try {
        //Question 모델 생성되면 
        Discussion.create(({user_id: req.body.user_id, question_id: req.body.question_id, discussion_content:req.body.discussion_content}))
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
