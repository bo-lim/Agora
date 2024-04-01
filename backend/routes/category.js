const mongoose = require("mongoose");

const GUESTBOOK_DB_ADDR = process.env.GUESTBOOK_DB_ADDR;
const mongoURI = "mongodb://" + GUESTBOOK_DB_ADDR + "/agora";

const db = mongoose.connection;

// ========================= Schema ============================
const cateSchema = mongoose.Schema({
  qualification_type: String,
}, {
  versionKey: false
});

const cateModel = mongoose.model("Category", cateSchema);

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
  const qualification_type = params.qualification_type; // 자격증 유형

  const cate = new cateModel({
    qualification_type: qualification_type,
  });

  return cate;
};

const save = (cate) => {
  console.log("saving cate...");
  cate.save((err) => {
    if (err) {
      throw err;
    }
  });
};

const create = (params) => {
  try {
    const cate = construct(params);
    const validationError = cate.validateSync();
    if (validationError) {
      throw validationError;
    }
    save(cate);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create: create,
  cateModel: cateModel,
  connectToMongoDB: connectToMongoDB,
};
