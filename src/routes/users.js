const router = require('express').Router();
var db = require('../connection/db');

router.get('/', async (req, res) => {
    res.status(200).json({message: 'Access to users on BooksCenter API'});
});

router.post('/register', async (req, res) => {
    console.log(`${req.method} on route ${req.path}`);
    try {
        const {newUsername, newhashedPassword, newUsertype} = req.body;
        const existe = await db.query('CALL existUser(?)', [newUsername]);

        if (existe.length == 0)
            throw new Error('El usuario ya existe');

        if (newUsername.length > 0 && newUsername.length < 30 && newhashedPassword.length > 0 && newhashedPassword.length < 100 && newUsertype.length > 0 && newUsertype.length < 15) {

            await db.query('CALL registerUser(?, ?, ?)', [loginUsername, hashedPassword, newUsertype]);
            res.status(200).json({message: 'Usuario registrado'});
        }else{
            throw new Error("Los campos no cumplen los requisitos");
            
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: error.message});
    }
});

router.post('/login', async (req, res) => {
    
});

module.exports = router;