const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://harshal:Lionelmessi1!@cluster0-2vfz0.mongodb.net/shop?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No Database found!";
};
exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
