const mongoose = require('mongoose')

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;

const db = mongoose.connection;

const userAnswersSchema = mongoose.Schema({
    user_id: { type: String, ref:"Users", required: [true, 'User_id is required'] },
    question_id: { type: String, ref:"Questions", required: [true, 'Question_id Body is required'] },
    selected_answer: { type: [String], required: [true, 'Selected_answer is required'] }
});
const userAnswersModel = mongoose.model('userAnswers', userAnswersSchema);

const construct = (params) => {
    const user_id = params.user_id
    const question_id = params.question_id
    const selected_answer = params.selected_answer
    const message = new userAnswersModel({ user_id: user_id, question_id: question_id, selected_answer: selected_answer })
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
    userAnswersModel: userAnswersModel
}

