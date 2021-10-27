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
module.exports = {

    getTests: async function () {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('tests');
            let result = await dCollection.find({}).toArray();
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    getTestById: async function (testId, userFromToken) {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('tests');
            let filter = userFromToken.role === "admin" ? {_id: ObjectId(testId)} : {
                user_id: userFromToken.id,
                _id: ObjectId(testId)
            };
            let result = await dCollection.find(
                filter,
                {projection: {user_answers: 0}}
            ).toArray();
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    // getTestById: async function (testId) {
    //     try {
    //         var client = await getMongoConn();
    //         let db = client.db(dbName);
    //         let dCollection = db.collection('tests');
    //         let result = await dCollection.find(
    //             {_id: ObjectId(testId)},
    //             {projection: {user_answers: 0}}
    //
    //         ).toArray();
    //         return result.length > 0 ? result[0] : null;
    //     } catch (err) {
    //         console.error(err);
    //     } finally {
    //         client.close();
    //     }
    // },
    getTestsByUser: async function (user) {
        try {
            var client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('tests');
            let result;
            if (user.role === 'admin') {
                result = await dCollection.find({}, {projection: {user_answers: 0}}).toArray();
            } else {
                result = await dCollection.find({user_id: userId}, {projection: {user_answers: 0}}).toArray();
            }

            return result;
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },
    addTest: async function (test, user) {

        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('tests');

            test.user_id = user.role === "admin" ? test.user_id : user.id;
            test._id = ObjectId(test._id);
            test.created_at = new Date();
            let result = await dCollection.insertOne(test);
            return await this.getTestById(result.insertedId, user);
        } catch (err) {
            throw err
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    editTest: async function (id, test, user) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('tests');
            test.user_id = user.role === "admin" ? test.user_id : user.id;
            test._id = ObjectId(id);
            const filter = {_id: ObjectId(id), user_id: (user.role === "admin" ? test.user_id : user.id)};

            let result = await dCollection.replaceOne(filter, test);
            return await this.getTestById(test._id, (user.role === "admin" ? test.user_id : user.id));
        } catch (err) {
            throw err
        } // catch any mongo error here
        finally {
            client.close();
        } // make sure to close your connection after
    },
    deleteTest: async function (id, user) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('tests');
            let res;
            if (user.role === 'admin') {
                res = await dCollection.deleteOne({_id: ObjectId(id)});
            } else {
                res = await dCollection.deleteOne({_id: ObjectId(id), user_id: user.id});
            }
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
    getUserByUsername: async function (username) {
        try {
            client = await getMongoConn();
            db = client.db(dbName);
            let dCollection = db.collection('users');
            let res = await dCollection.find({"username": username}).toArray();
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
            Object.keys(update).forEach(s => {
                if (update[s]) {
                    set[s] = update[s];
                } else {
                    unset[s] = update[s];
                }
            })
            let query = {$set: set, $unset: unset};
            let res = await dCollection.updateOne({_id: userId}, query);
        } catch (err) {
            console.error(err);
        } finally {
            client.close();
        }
    },

    saveUserAnswer: async function (userAnswer, userFromToken) {
        console.log(userAnswer)
        console.log(userFromToken)
        if (userFromToken.role !== "admin") {
            throw {code: 405}
        }
        if (!userAnswer.user_id || !userAnswer.test_id) {
            throw {code: 400, message: "user_id or test_id not specified"}
        }
        try {
            client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('tests');
            let check = await dCollection.find(
                {
                    _id: ObjectId(userAnswer.test_id),
                    user_answers: {
                        $elemMatch: {user_id: userAnswer.user_id}
                    }
                }
            ).toArray();

            if (check.length > 0) {
                throw {code: 500, message: "User's answer for this question already exists or test not found"}
            }
            let test_id = userAnswer.test_id;
            delete userAnswer.test_id;
            let result = await dCollection.updateOne(
                {_id: ObjectId(test_id)},
                {$push: {"user_answers": userAnswer}}
            )
            return result
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }
    },
    getUserAnswersByFilter: async function (filter, tokenUser) {
        let filterUser = filter.user_id;
        let filterTest = filter.test_id;
        let filterCreator = filter.creator;
        console.log(filter)
        console.log(tokenUser)
        try {
            client = await getMongoConn();
            let db = client.db(dbName);
            let dCollection = db.collection('tests');

            let filter = {};
            if (tokenUser.role === 'admin') {
                if (!filterCreator || !filterTest) {
                    throw {code: 400, message: "creator or test_id not specified"}
                }
                filter = {
                    user_id: filterCreator,
                    _id: ObjectId(filterTest),
                    user_answers: {
                        $elemMatch: {user_id: filterUser}
                    }
                }
            } else {
                if (!filterTest) {
                    throw {code: 400, message: "test_id not specified"}
                }
                filter = {
                    user_id: tokenUser.id,
                    _id: ObjectId(filterTest),
                    user_answers: {
                        $elemMatch: {user_id: filterUser}
                    }
                }
            }
            let projection = {user_answers: 1}

            let res = await dCollection.find(filter, {projection: projection}).toArray();
            console.log(res)
            res = res.map(s => {
                if (filterUser){}
                s.user_answers  = s.user_answers.filter(ua=>{
                    return ua.user_id===filterUser;
                })
                s.id = s._id;
                delete s._id;
                return s;
            })
            return res
        } catch (err) {
            throw err;
        } finally {
            client.close();
        }
    },


}

async function getMongoConn() {
    return await MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
}