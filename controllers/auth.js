
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function(req,res){
    const candidate = await User.findOne({email: req.body.email})
    if(candidate) {
        //пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult) {
            //герерация токена, пароли совпали
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            },keys.jwt,{expiresIn: 60*60})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        }else{
            //пароли не совпали
            res.status(401).json({
                message:'пароли не совпадают, пробуйте еще '
                
            })
        }
    } else{
        //пользователя не существует
        res.status(404).json({
            message: 'Пользователь с таким Email не найден'
        })
    }
}

module.exports.register = async function(req,res){
    //email, password
    const candidate = await User.findOne({email: req.body.email})
        
    if(candidate) {
        res.status(409).json({
            message: 'такой email уже занят'
        })
    } else{
        //создаем пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try {
            await user.save()
            res.status(201).json(user)
        } catch(e){
            //обработать ошибку
            errorHandler(res,e)
        }
    }
   /*  const user = new User ({
        email: req.body.email,
        password: req.body.password
    })
    user.save().then(()=> console.log('user ccc')) */
}