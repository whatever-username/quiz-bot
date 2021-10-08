const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME
const dbAddress = process.env.DB_ADDRESS
const uri = "mongodb://" + user + ":" + pass + "@" + dbAddress + "/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"
console.log(user)
console.log(pass)
console.log(dbName)
console.log(dbAddress)
module.exports= {

    getQuizes: async function () {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('quizes');
            let result = await dCollection.find({}).toArray();
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    getQuizById: async function (quizId, userId) {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('quizes');
            let result = await dCollection.find(
                {user_id: userId, _id: ObjectId(quizId)}
            ).toArray();
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    getQuizById: async function (quizId) {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('quizes');
            let result = await dCollection.find(
                {_id: ObjectId(quizId)}
            ).toArray();
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    getQuizesByUserId: async function (userId) {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('quizes');
            let result = await dCollection.find({user_id: userId}, {projection: {"user_id": false}}).toArray();
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    addQuiz: async function (quiz, userId) {
        try {
            client = await getMongoConn();
            quiz.user_id = userId;
            quiz._id = ObjectId(quiz._id);
            db = client.db(dbName);
            let dCollection = db.collection('quizes');

            let result = await dCollection.insertOne(quiz);
            return await this.getQuizById(result.insertedId, userId);
        } catch (err) {
            throw err
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    editQuiz: async function (id, quiz, userId) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('quizes');
            quiz.user_id = userId;
            quiz._id = ObjectId(id);
            const filter = {_id: ObjectId(id), user_id: userId};

            let result = await dCollection.replaceOne(filter, quiz);
            return await this.getQuizById(quiz._id, userId);
        } catch (err) {
            throw err
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    deleteQuiz: async function (id, userId) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('quizes');
            let res = await dCollection.deleteOne({_id: ObjectId(id), user_id: userId});
            return res;
        } catch (err) {
            throw err
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    getUserById: async function (id) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('users');
            let res = await dCollection.find({"_id": id}).toArray();
            res = res.map(s => {
                s.id = s._id;
                delete s._id;
                return s;
            });
            return (res && res[0]) ? res[0] : null;
        } catch (err) {
            console.error(err);
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    saveUser: async function (user) {
        user._id = user.id
        delete user.id;
        let keysToTrim = ["photo_url", "auth_date"]
        keysToTrim.forEach(value => {
            delete user[value]
        })
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('users');

            let result = await dCollection.insertOne(user);
            return result;
        } catch (err) {
            console.error(err);
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    updateUser: async function (userId, update) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('users');
            console.log(update)
            let set = {};
            let unset = {};
            Object.keys(update).forEach(s =>{
                if (update[s]){
                    set[s]=update[s];
                }else {
                    unset[s]=update[s];
                }
            })
            let query= {$set:set,$unset:unset};
            let res = await dCollection.updateOne({_id:userId},query);
        } catch (err) {
            console.error(err);
        }
        finally {
            client.close();
        }
    },
}

async function getMongoConn() {
    return await MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
}