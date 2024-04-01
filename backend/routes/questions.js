const mongoose = require("mongoose");

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;
const mongoURI = "mongodb://" + GUESTBOOK_DB_ADDR + "/agora";

const db = mongoose.connection;

// ========================= Schema ============================
const qstCounterSchema = mongoose.Schema(
  {
    type: String,
    count: Number,
  },
  {
    collection: "qst_counter",
  }
);

const qstCounter = mongoose.model("qst_counter", qstCounterSchema);

module.exports = { qstCounter };

const qstSchema = mongoose.Schema({
  _id: String,
  user_id: {
    type: String,
    ref: "users", // users의 _id 참조해오기
  },
  qualification_type: String,
  question_text: String,
  options: [String],
  correct_answer: [String],
}, {
  versionKey: false
});

const qstModel = mongoose.model("Questions", qstSchema);

db.on("disconnected", () => {
  console.error(`Disconnected: unable to reconnect to ${mongoURI}`);
  throw new Error(`Disconnected: unable to reconnect to ${mongoURI}`);
});
db.on("error", (err) => {
  console.error(`Unable to connect to ${mongoURI}: ${err}`);
});
db.once("open", () => {
  console.log(`connected to ${mongoURI}`);
});

const connectToMongoDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    connectTimeoutMS: 2000,
    reconnectTries: 1,
  });
};

const construct = async (params) => {
  const question_id = params.question_id; // type_count
  const user_id = params.user_id; // 문제 작성자
  const qualification_type = params.qualification_type; // 자격증 유형
  const question_text = params.question_text; // 문제 내용
  const options = params.options; // 선택지 (A ..)
  const correct_answer = params.correct_answer; //정답
  // const ratio = params.ratio

  const qst = new qstModel({
    question_id: question_id,
    user_id: user_id,
    qualification_type: qualification_type,
    question_text: question_text,
    options: options,
    correct_answer: correct_answer,
  });
  return qst;
};

const save = (qst) => {
  console.log("saving question...");
  qst.save((err) => {
    if (err) {
      throw err;
    }
  });
};

const create = (params) => {
  try {
    const qst = construct(params);
    const validationError = qst.validateSync();
    if (validationError) {
      throw validationError;
    }
    save(qst);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create: create,
  qstCounter: qstCounter,
  qstModel: qstModel,
  connectToMongoDB: connectToMongoDB,
};
