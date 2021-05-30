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
    const cnpj = req.body.cnpj;

    const [rowsMail] = await conn.query(`SELECT * FROM usuario WHERE cd_email_usuario = ?`, [email])

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass, salt);

    if(!username || !email || !pass || !confPass || uf == 0 || city == 0){
        erros.push({text: 'Não deixe nenhum campo vazio!'})
    }

    if(rowsMail.length > 0) {
        erros.push({text: 'Esse e-mail já está cadastrado!'})
    }

    if (req.body.pass !== req.body.passConf){
        erros.push({text: 'As senhas não coincidem!'})
    }

    if(req.body.pessoa == 'pj' && cnpj.length < 14){
        erros.push({text: 'CNPJ Inválido'})
    }

    if(req.body.pessoa == 'pf' && cpf.length < 11){
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
        try{
            if(req.body.pessoa == 'pf'){
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
            }
            else if(req.body.pessoa == 'pj'){
                await conn.query(
                    `INSERT INTO
                    usuario
                    (nm_usuario, cd_cnpj_usuario, 
                    cd_celular_usuario, sg_estado_usuario, nm_cidade_usuario,
                    cd_senha_usuario, cd_email_usuario) VALUES(?,?,?,?,?,?,?)`
                ,[
                    username,
                    cnpj,
                    cel,
                    uf,
                    city,
                    hash,
                    email
                ])
            }    
            req.flash('successMsg', 'Usuário cadastrado com sucesso!')
            res.redirect('/login')
        }
        catch(err){
            console.log(err)
            req.flash('errorMsg', 'Erro inesperado')
            res.redirect('/')
        }
        
    }
    await conn.end();
};