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

app.get('/quizes', authenticateJWT,async (req, res) => {
    let quizes = await db.getQuizesByUserId(req.user.id)

    res.json(quizes);
});
app.get('/quizes/:quizId', authenticateJWT,async (req, res) => {
    console.log(req.params.quizId)
    if (req.params.quizId){
        let result = await db.getQuizById(req.params.quizId, req.user.id)
        res.json(result);
        return
    }
    res.json({error:true})
});
app.post('/quizes',authenticateJWT,async (req, res) => {
    if (req.body){
        try {
            let result = await db.addQuiz(req.body, req.user.id)
            res.json(result);
            return
        }catch (error){
            console.log(error)
            res.error()
        }
    }
    res.json({error:true})
});
app.put('/quizes/:quizId', authenticateJWT,async (req, res) => {
    console.log(req.params.quizId)
    if (req.params.quizId){
        let result = await db.editQuiz(req.params.quizId, req.body, req.user.id)
        res.json(result);
        return
    }
    res.json({error:true})
});
app.delete('/quizes/:quizId', authenticateJWT,async (req, res) => {
    try {

        if (req.params.quizId){
            let result = await db.deleteQuiz(req.params.quizId, req.user.id)
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

