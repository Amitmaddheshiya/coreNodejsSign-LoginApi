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
            reject({
              status_code: 404,
              message: "Data not found !"
            })
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
            reject({
              status_code: 404,
              message: "Data not found !"
            })
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
          reject({
            status_code: 500,
            message: "Internal server error !"
          });
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
          reject({
            status_code: 500,
            message: "Internal server error !"
          });
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
