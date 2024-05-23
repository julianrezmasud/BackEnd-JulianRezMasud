import CustomRouter from './custom.routes.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import * as UserController from '../../controllers/users.controller.js'


export default class UsersExtendRouter extends CustomRouter {
    init() {
        // inicializa todo el custom router.

        // con el this hacemos referencia al get de CustomRouter
        this.get("/", ["PUBLIC"], (req, res) => { //path,policies(PUBLIC),callbacks
            res.sendSuccess(req.user) // este es el payload
        })


        this.get("/current", ["USER", "ADMIN", "PREMIUM"], (req, res) => {

            const token = req.headers.authorization
            const tokenNormalice = token.split(' ')[1]
            console.log(tokenNormalice, " :::::::::::::::::::::::::::")
            const decodeToken = jwt.decode(tokenNormalice)
            res.sendSuccess(decodeToken);
        });


        this.get("/current/admin", ["ADMIN"], (req, res) => {
            res.sendSuccess(req.user);
        });

        this.get("/current/user", ["USER"], (req, res) => {
            res.sendSuccess(req.user);
        });

        //GET ALL USERS
        this.get('/all', ["PUBLIC"], UserController.getAllUsers)




        // ? LOGIN Y REGISTER ABIERTO PUBLICAMENTE 
        // LOGIN
        this.post('/login', ['PUBLIC'], UserController.userLogin)

        // LOGOUT
        this.get('/logout', ['PUBLIC'], UserController.userLogout)

        // REGISTER
        this.post('/register', ['PUBLIC'], UserController.userRegister)
        // GITHUB LOGIN
        // endpoint para API de estrategia de login con github (passport.config)
        this.get('/github', ["PUBLIC"], passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });
        // GITHUB LOGIN CALLBACK
        this.get('/githubcallback', ['PUBLIC'], passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), UserController.userRegisterByGithub)


    }


}








