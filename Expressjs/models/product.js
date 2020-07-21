const mongodb = require("mongodb");
const getDb = require("../util/database").getDB;

class Product {
  constructor(title, imageUrl, description, price, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // update
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    // find returns a cursor which is a controller / handle. In order to get elements, toArray() is chained.
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static findById(id) {
    const db = getDb();
    //  here too the find() provides a cursor and as we have only one matching product for the given filter, next would give us the very next element
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  static deleteById(id) {
    const db = getDb();

    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .then(() => {
        console.log("Deleted");
      })
      .catch((error) => console.log(error));
  }
}
module.exports = Product;
