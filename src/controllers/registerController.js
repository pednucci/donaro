const db = require('../database/database');
const bcrypt = require('bcrypt')

exports.register = async (req, res) => {
    var erros = [];

    const conn = await db.connection();

    const username = req.body.username;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const dtUser = req.body.dtuser;
    const pass = req.body.pass;
    const confPass = req.body.passConf;
    const city = req.body.cidade;
    const uf = req.body.estado;
    const cel = req.body.cel;

    const [rowsMail] = await conn.query(`SELECT * FROM usuario WHERE cd_email_usuario = ?`, [email])

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    if(uf == 0 || city == 0){
        erros.push({text: 'Selecione um estado/cidade válido!'})
    }

    if(rowsMail.length > 0) {
        erros.push({text: 'Esse e-mail já está cadastrado!'})
    }

    if (req.body.pass !== req.body.passConf){
        erros.push({text: 'As senhas não coincidem!'})
    }

    if(cpf.length < 11){
        erros.push({text: 'CPF Inválido'})
    }

    if(cel.length < 11){
        erros.push({text: 'Número inválido! (Exemplo: DDD + Número'})
    }

    if(erros.length > 0)
    {
        res.render('login/cadastro', {
            erros: erros
        })
    } else{
        await conn.query(
            `INSERT INTO
            usuario
            (nm_usuario, cd_cpf_usuario,
            dt_nascimento_usuario, cd_celular_usuario, sg_estado_usuario, nm_cidade_usuario,
            cd_senha_usuario, cd_email_usuario) VALUES(?,?,?,?,?,?,?,?)`
        ,[
            username,
            cpf,
            dtUser,
            cel,
            uf,
            city,
            hash,
            email
        ])
        
        req.flash('successMsg', 'Usuário cadastrado com sucesso!')
        res.redirect('/login')
        await conn.end();
    }
    await conn.end();
};