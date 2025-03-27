const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

app.post('/register', (req,res) => {
    const {username, password} = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({message: 'Пользователь уже существует'});
    }

    const newUser = {id: users.length + 1, username, password}
    users.push(newUser);
    res.status(201).json({message: 'Пользователь успешно зарегистрирован'});
})

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const user = users.find(u => u.username===username && u.password===password);
    if (!user){
        res.status(401).json({message: "Неверные данные"});
        return;
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res.json({token});

});

const authenticalJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader)
    {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
    
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/protected', authenticalJWT, (req,res) => {
    res.json({message: "Это защищенный route", user: req.user});

});


app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}/`);
});