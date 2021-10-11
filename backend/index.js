const db = require('./db/db');
const express = require('express')
const bodyParser = require('body-parser')
const util = require('./util');
const app = express()
var cors = require('cors')
var jwt = require('jsonwebtoken');

app.use(bodyParser.json());

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log("JWT_SECRET_KEY:"+JWT_SECRET_KEY)
const port = process.env.BACKEND_PORT;
console.log("BACKEND_PORT:"+port)

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
            if (err) {
                if (err.name==="TokenExpiredError"){
                    return res.sendStatus(401)
                }
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};


app.use(cors({
    origin: '*'
}))

app.post('/login',async (req, res) => {
    let body = req.body;
    if (await util.checkTGHash(body)){
        let user = await db.getUserById(body.id)
        if (!user) {
            user = await db.saveUser(body)
        }
        console.log(user)
        const accessToken = await util.sign(user);
        res.json({
            accessToken
        });
        return;
    }
    return res.sendStatus(403);
});

app.get('/tests', authenticateJWT,async (req, res) => {
    let tests = await db.getTestsByUserId(req.user.id)

    res.json(tests);
});
app.get('/tests/:testId', authenticateJWT,async (req, res) => {
    console.log(req.params.testId)
    if (req.params.testId){
        let result = await db.getTestById(req.params.testId, req.user.id)
        res.json(result);
        return
    }
    res.json({error:true})
});
app.post('/tests',authenticateJWT,async (req, res) => {
    if (req.body){
        try {
            let result = await db.addTest(req.body, req.user.id)
            res.json(result);
            return
        }catch (error){
            console.log(error)
            res.error()
        }
    }
    res.json({error:true})
});
app.put('/tests/:testId', authenticateJWT,async (req, res) => {
    console.log(req.params.testId)
    if (req.params.testId){
        let result = await db.editTest(req.params.testId, req.body, req.user.id)
        res.json(result);
        return
    }
    res.json({error:true})
});
app.delete('/tests/:testId', authenticateJWT,async (req, res) => {
    try {

        if (req.params.testId){
            let result = await db.deleteTest(req.params.testId, req.user.id)
            res.json(result);
            return
        }
    }catch (err){
        console.log(err)
        res.error();
    }

    res.json({error:true})
});




app.listen(
    port,

    () => console.log(`app listening at http://localhost:${port}`)
);

