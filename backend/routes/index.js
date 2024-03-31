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
    console.log(`create opinion`)
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

router.get('/discussion',(req,res) => {
    console.log(`discussion collections`)
    try {
        Discussion.discussionsModel.find({question_id: req.body.question_id}, (err,messages) => {
            let list = []
            console.log(messages)
            if (messages.length > 0) {
                messages.forEach((message) => {
                    if (message.user_id && message.discussion_content){
                        list.push({ 'user_id' : message.user_id, 'discussion_content' : message.discussion_content})
                    }
                });
            }
            res.status(200).json(list)
        });
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;
