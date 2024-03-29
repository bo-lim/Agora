const mongoose = require('mongoose')

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;
const mongoURI = "mongodb://" + GUESTBOOK_DB_ADDR + "/agora"

const db = mongoose.connection;

const discussionsSchema = mongoose.Schema({
    user_id: { type: String, required: [true, 'User_id is required'] },
    password: { type: String, required: [true, 'Password Body is required'] }
});
const discussionsModel = mongoose.model('Discussions', discussionsSchema);

db.on('disconnected', () => {
    console.error(`Disconnected: unable to reconnect to ${mongoURI}`)
    throw new Error(`Disconnected: unable to reconnect to ${mongoURI}`) 
})
db.on('error', (err) => {
    console.error(`Unable to connect to ${mongoURI}: ${err}`);
});

db.once('open', () => {
  console.log(`connected to ${mongoURI}`);
});

const connectToMongoDB = async () => {
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        connectTimeoutMS: 2000,
        reconnectTries: 1
    })
};

const construct = (params) => {
    const user_id = params.user_id
    const password = params.password
    const message = new discussionsModel({ user_id: user_id, password: password })
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
    discussionsModel: discussionsModel,
    connectToMongoDB: connectToMongoDB,
}

