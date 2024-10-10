const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const ObjectId = require("mongodb").ObjectId;

// establish connection
const config = ()=>{
  return new Promise((resolve,reject)=>{
    mongo.connect(url,(error,conn)=>{
      const db = conn.db("nodewap");
      resolve(db);
    });
  });
}

// fetch or find data
exports.find = (query,collection_name)=>{
  return new Promise((resolve,reject)=>{
    config().then((db)=>{
      db.collection(collection_name).find(query).toArray((error,dataRes)=>{
        if(dataRes.length != 0)
        {
            resolve({
              status_code: 200,
              data: dataRes,
              message: "Match found !"
            });
        }
        else{
          const error = new Error("Data not found !");
          error.status_code = 404;
          reject(error);
        }
      });
    });
  });


}

// fetch data by id
exports.findById = (id,collection_name)=>{
  return new Promise((resolve,reject)=>{
    config().then((db)=>{
      db.collection(collection_name).find({"_id":ObjectId(id)}).toArray((error,dataRes)=>{
        if(dataRes.length != 0)
        {
            resolve({
              status_code: 200,
              data: dataRes,
              message: "Match found !"
            });
        }
        else{
          const error = new Error("Data not found !");
          error.status_code = 404;
          reject(error); 
        }
      });
    });
  });


}

// insert data
exports.insertOne = (formdata,collection_name)=>{
  return new Promise((resolve,reject)=>{
    config().then((db)=>{
      db.collection(collection_name).insertOne(formdata,(error,dataRes)=>{
        if(error)
        {
          const error = new Error("Data not found !");
error.status_code = 404;
reject(error);
        }
        else{
          resolve({
            status_code: 200,
            data: dataRes,
            message: "Data inserted !"
          });
        }
      });
    });
  });
}

// update
exports.updateById = (id,formdata,collection_name)=>{
  return new Promise((resolve,reject)=>{
    config().then((db)=>{
      db.collection(collection_name).updateOne({"_id":ObjectId(id)},formdata,(error,dataRes)=>{
        if(error)
        {
          const error = new Error("Data not found !");
error.status_code = 404;
reject(error);
        }
        else{
          resolve({
            status_code: 201,
            data: dataRes,
            message: "Data updated !"
          });
        }
      });
    });
  });

}
