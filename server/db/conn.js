const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: async function (callback) {
    try {
      await client.connect();
      _db = client.db("shop");
      console.log("Successfully connected to database");
      if (callback) callback();
    } catch (e) {
      console.error(e);
      if (callback) callback(e);
    }
  },
  getDb: function () {
    return _db;
  },
};
