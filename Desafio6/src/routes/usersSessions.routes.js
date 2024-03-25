import { Router } from 'express';
import passport from 'passport'

const router = Router();


//* ACA VAN LAS APIS. TODA LA LOGICA DE LAS SESIONES ACA.  users.views.router SOLO GENERABA RENDERS


// API PARA REGISTER
//? el proceso de registro no lo va a hacer mas router. Lo hara passport.config
// {failureRedirect:'/api/sessions/fail-register'} -> por si falla, lo redirecciona a una ruta de falla(podemos llevarlo a plantilla hb)
router.post("/register", passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    res.status(200).send({ status: 'success', message: 'User registered' })
});



// API PARA LOGIN (en teoria ya esta registrado (signin)).
//? el proceso de logueo no lo va a hacer mas router. Lo hara passport.config
router.post("/login", passport.authenticate('login', { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).send({ status: 'error', error: 'Incorrect credentials' })
    req.session.user = {
        // en este objeto pasamos la informacion que se necesita para la plantilla products. Es decir, para el endpoint /products
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.status(200).send({ status: "success", payload: req.session.user, msg: "Logueo exitoso" });


});



// ruta para cuando falle el registro (hacer a plantilla hb)
router.get('/fail-register', async (req, res) => {
    res.status(401).send({ error: 'Register Failed' })
})
// ruta para cuando falle el login (hacer a plantilla hb)
router.get('/fail-login', async (req, res) => {
    res.status(401).send({ error: 'Login Failed' })
})



export default router;