const db = require('./db/db');
const express = require('express')
const bodyParser = require('body-parser')
const util = require('./util');
const postsRoutes = require('./posts');

const app = express()
var cors = require('cors')
var jwt = require('jsonwebtoken');
var axios = require('axios');
app.use(bodyParser.json());

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const BOT_TOKEN = process.env.BOT_TOKEN;
console.log("JWT_SECRET_KEY:" + JWT_SECRET_KEY)
const port = process.env.BACKEND_PORT;
console.log("BACKEND_PORT:" + port)
var AUTH_CODES_CACHE = {};

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
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

app.post('/login', async (req, res) => {
    let body = req.body;
    if (await util.checkTGHash(body)) {
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
app.post('/login/bot_code', async (req, res) => {
    let body = req.body;
    if (!body || !body.username) {
        res.status(404).send('Не указан username пользователя');
    }
    let username = body.username;
    let user = await db.getUserByUsername(username);
    if (!user) {
        res.status(404).send('Пользователь не найден');
        return
    }
    if (AUTH_CODES_CACHE[user.id]) {
        res.status(500).send('Таймаут на отправку кода');
        return
    }
    let code = '';
    for (let i = 0; i < 4; i++) {
        code = code.concat(parseInt(Math.random() * 10))
    }
    let text = "Код будет действителен в течение 60 секунд\n" + code
    let resp;
    try {
        resp = await axios.post("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", null, {
            params: {
                chat_id: user.id,
                text: text
            }
        });
    } catch (err) {
        if (err.response.data.description === 'Bad Request: chat not found') {
            res.status(500).send('Бот не был запущен на этом аккаунте. Невозможно отправить код')
            return
        }
    }
    AUTH_CODES_CACHE[user.id] = code
    setTimeout(() => {
        delete AUTH_CODES_CACHE[user.id]
    }, 60 * 1000)
    console.log(AUTH_CODES_CACHE)
    res.send("Код отправлен");
});
app.post('/login/bot_code/check', async (req, res) => {

    let body = req.body;
    if (!body || !body.username || !body.code) {
        return res.sendStatus(400)
    }
    let username = body.username;
    let code = body.code;
    let user;
    try {
        user = await db.getUserByUsername(username);
    } catch (ex) {
        log.error(ex);
        res.sendStatus(404);
        return
    }
    console.log(AUTH_CODES_CACHE)
    if (AUTH_CODES_CACHE[user.id] === (code + "")) {
        const accessToken = await util.sign(user);
        res.json({
            accessToken
        });
        delete AUTH_CODES_CACHE[user.id]
        return
    }

    res.sendStatus(404);
});

app.get('/tests', authenticateJWT, async (req, res) => {
    let tests = await db.getTestsByFilter(req.user, req.query)

    res.json(tests);
});
app.get('/tests/:testId', authenticateJWT, async (req, res) => {
    console.log(req.params.testId)
    if (req.params.testId) {
        let result = await db.getTestById(req.params.testId, req.user)
        res.json(result);
        return
    }
    res.json({error: true})
});
app.post('/tests', authenticateJWT, async (req, res) => {
    if (req.body) {
        try {
            let result = await db.addTest(req.body, req.user)
            res.json(result);
            return
        } catch (error) {
            console.log(error)
            res.error()
        }
    }
    res.json({error: true})
});
app.put('/tests/:testId', authenticateJWT, async (req, res) => {
    if (req.params.testId) {
        let result = await db.editTest(req.params.testId, req.body, req.user)
        res.json(result);
        return
    }
    res.json({error: true})
});
app.delete('/tests/:testId', authenticateJWT, async (req, res) => {
    try {

        if (req.params.testId) {
            let result = await db.deleteTest(req.params.testId, req.user)
            res.json(result);
            return
        }
    } catch (err) {
        console.log(err)
        res.error();
    }

    res.json({error: true})
});

app.post('/user_answers', authenticateJWT, async (req, res) => {
    if (req.body) {
        try {
            let result = await db.saveUserAnswers(req.body, req.user)
            res.json(result);
            return
        } catch (error) {
            console.log(error)
            res.status(error.code ? error.code : 500).send(error.message)
            return
        }
    }
    res.json({error: true})
});
app.post('/user_answers/filter', authenticateJWT, async (req, res) => {
    if (req.body) {
        try {
            let result = await db.getUserAnswersByFilter(req.body, req.user)
            res.json(result);
            return
        } catch (error) {
            console.log(error)
            res.status(error.code).send(error.message)
            return
        }
    }
    res.json({error: true})
});

app.use("/posts/", authenticateJWT, postsRoutes);


test()

async function test() {
    // await db.getUserAnswersByFilter({user_id: 74374352, test_id: "616b168627ddad42c110044a"})
}

app.listen(
    port,

    () => console.log(`app listening at http://localhost:${port}`)
);

