const db = require('./db/db');
const express = require("express");
const router = express.Router();


router.get('', async  (req, res) => {
    // let posts = await db.getPosts(req.user, req.query)

    res.json({"_id":{"$oid":"618d4dfe9b6c09c255bd5dc5"},"text":"qweqwqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqqweqweqweqweqwwqewqwqew eqewqweqweqwweqeqweqweqwwqewqwqew eqewqweqweqwweq"});
});

module.exports = router;
