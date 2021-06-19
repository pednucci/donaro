const express = require('express')
const router = express.Router();
const db = require('../database/database');
const registerController = require('../controllers/registerController');
const passport = require('passport');
const { isAuth } = require('../helpers/isAuth');
const path = require('path');
const bcrypt = require('bcrypt');

router.get('/cadastro', (req, res) => {
    res.render('login/cadastro')
})

router.post('/cadastro', registerController.register)

router.get('/login', (req, res) => {
    res.render('login/login')
})

router.post('/isLogged', (req, res) => {
    if(req.user) res.status(200).send("true");
    else res.status(404).send("false");
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true})
)

router.get('/perfil', isAuth, async (req, res) => {
    const conn = await db.connection();
    const [perfil] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario = ?`, [req.user[0].cd_usuario]);
    res.render('login/informacoes', {
        perfil
    })
})

router.post('/perfil', async (req, res) => {
    const conn = await db.connection();
    try{
        var erros = [];
        const [usuario] = await conn.query(`SELECT * FROM usuario WHERE cd_usuario = ?`,
        [req.user[0].cd_usuario])
        const compare = bcrypt.compareSync(req.body.pass, usuario[0].cd_senha_usuario)

        if(!req.body.username || !req.body.email ||
        !req.body.cel || !req.body.estado || !req.body.cidade || !req.body.pass || !req.body.passConf){
            erros.push({text: 'Não deixe campos em branco!'})
        }

        if(erros.length > 0){
            res.render('login/informacoes', {
                perfil: usuario,
                erros
            })
        }
        else{
            if (compare && req.body.pass == req.body.passConf) {
                if(req.files){
                    fileUpload = req.files.userImg;
                    uploadPath = path.join(__dirname, '..', '..', '/public/assets/profile/' + fileUpload.name)  ;
                    fileUpload.mv(uploadPath, async (err) => {
                        if(err){
                            req.flash("errorMsg", "Houve um erro ao cadastrar o pedido!")
                            console.log(err)
                            res.redirect('/')
                        }
                        else{
                            await conn.query(`UPDATE usuario SET cd_foto_usuario = ? WHERE
                            cd_usuario = ?`, [fileUpload.name, req.user[0].cd_usuario])
                        }
                    })
                }
                if (req.body.newPass) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(req.body.newPass, salt);
                    await conn.query(`UPDATE usuario SET nm_usuario = ?, cd_email_usuario = ?,
                    cd_celular_usuario = ?, sg_estado_usuario = ?, nm_cidade_usuario = ?,
                    cd_senha_usuario = ?
                    WHERE cd_usuario = ?`, [req.body.username, req.body.email,
                    req.body.cel, req.body.estado, req.body.cidade, hash ,req.user[0].cd_usuario])
                }
                else {
                    await conn.query(`UPDATE usuario SET nm_usuario = ?, cd_email_usuario = ?,
                    cd_celular_usuario = ?, sg_estado_usuario = ?, nm_cidade_usuario = ?
                    WHERE cd_usuario = ?`, [req.body.username, req.body.email,
                    req.body.cel, req.body.estado, req.body.cidade, req.user[0].cd_usuario])
                }
                req.flash('successMsg', 'Dados alterados!');
                res.redirect('/')
            }
            else{
                erros.push({text: 'Senha inválida ou/e as senhas não coincidem!'})
                res.render('login/informacoes', {
                    perfil: usuario,
                    erros
                })
            }
        }
    }
    catch(err){
        console.log(err);
        req.flash('errorMsg', 'Erro inesperado');
        res.redirect('/')
    }
})

module.exports = router;

