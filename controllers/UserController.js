
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


import { validationResult } from 'express-validator';
import UserModel from '../models/user.js'

export const register = async (req, res) => {
    try {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        secretWord: req.body.secretWord,
        passwordHash: hash,
      });
  
      const user = await doc.save();
  
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось зарегистрироваться',
      });
    }
  };

  export const login = async (req, res) => {
    try {
      const { email, password, secretWord: secret } = req.body;
      
      let user;
      if (email && password) {
        user = await UserModel.findOne({ email });
      } else if (email && secret) {
        user = await UserModel.findOne({ email, secretWord: secret });
      } else {
        return res.status(400).json({
          message: 'Недостаточно данных для авторизации',
        });
      }
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден',
        });
      }
      if (password) {
        const isValidPass = await bcrypt.compare(password, user._doc.passwordHash);
        if (!isValidPass) {
          return res.status(400).json({
            message: 'Неверный логин или пароль',
          });
        }
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        'secret123',
        {
          expiresIn: '30d',
        },
      );
      const { passwordHash, secretWord, ...userData } = user._doc;
        console.log(req.body);
      res.json({
        ...userData,
        token,
        secretWord
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось авторизоваться',
      });
    }
  };
  
  
export const getMe = async (req , res ) =>{
    try {

        const user  = await UserModel.findById(req.userId) 
        if(!user){
            return res.status(404).json({
                msg : 'Пользователь не найден '
            })
        }else{
            res.json(user)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg : 'Не удалось зарегистрироваться '
        })
    }
}