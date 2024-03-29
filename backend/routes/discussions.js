const mongoose = require('mongoose')

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;

const db = mongoose.connection;

const discussionsSchema = mongoose.Schema({
    user_id: { type: String, ref:"Users", required: [true, 'User_id is required'] },
    question_id: { type: String, ref:"Questions", required: [true, 'Question_id Body is required'] },
    discussion_content: { type: String, required: [true, 'Discussion_content is required'] }
});
const discussionsModel = mongoose.model('Discussions', discussionsSchema);

const construct = (params) => {
    const user_id = params.user_id
    const question_id = params.question_id
    const discussion_content = params.discussion_content
    const message = new discussionsModel({ user_id: user_id, question_id: question_id, discussion_content: discussion_content })
    return message
};

const save = (message) => {
    console.log("saving message...")
    message.save((err) => {
        if (err) { throw err }
    })
};

const create = (params) => {
    try {
        const msg = construct(params)
        const validationError = msg.validateSync()
        if (validationError) { throw validationError }
        save(msg)
    } catch (error) {
        throw error
    }
}

module.exports = {
    create: create,
    discussionsModel: discussionsModel
}

