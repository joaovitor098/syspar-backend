const express = require("express");
var router = express.Router();
const totalvoice = require("totalvoice-node");
const client = new totalvoice("faaa1d4aaf09fc61f08e3f75fdb728ed");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const autenticacao = require("../middlware/autenticação");
// ROTAS USUÁRIO

router.get("/usuario", (req, res) => {
    global.db.findUsuario((error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result.length == 0) {
            return res
                .status(200)
                .json({ erro: false, mensagem: "Nenhum usuário cadastrado" });
        }
        res.status(200).json({ dados: result, error: false });
    });
});

router.post("/admin/usuario/novo", (req, res) => {
    let usuario = req.body.usuario;
    let matricula = req.body.matricula;
    let senha = req.body.senha;
    let senha2 = req.body.senha2;
    let email = req.body.email;
    let cargo = req.body.cargo;
    let nome = req.body.nome;
    let telefone = req.body.telefone
        .replace(" ", "")
        .replace("-", "")
        .replace(".", "");

    var erro = [];
    if (!usuario || usuario == null) {
        erro.push("Usuário está vazio");
    }
    if (!telefone || telefone == null) {
        erro.push("Telefone está vazio");
    }
    if (!matricula || matricula == null) {
        erro.push("A matricula está vazio");
    }
    if (!senha || senha == null) {
        erro.push("A senha está vazio");
    }
    if (!senha2 || senha2 == null) {
        erro.push("Campo de confirmar senha está vazio");
    }
    if (senha != senha2) {
        erro.push("As senhas são diferentes");
    }
    if (!email || email == null) {
        erro.push("O email está vazio");
    }
    if (!cargo || cargo == null) {
        erro.push("O cargo está vazio");
    }
    if (!nome || nome == null) {
        erro.push("O nome está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).json({ error: true, mensagem: erro });
    }

    bcrypt.hash(senha, 10, (erro, hash) => {
        if (erro) {
            return res.status(400).json(erro);
        } else {
            global.db.inserirUsuario(
                {
                    usuario,
                    matricula,
                    senha: hash,
                    telefone,
                    email,
                    cargo,
                    nome
                },
                error => {
                    if (error) {
                        return res.status(400).json(erro);
                    }
                    return res
                        .status(201)
                        .json({
                            erro: false,
                            mensagem: "Usuario cadastrado com sucesso !!"
                        });
                }
            );
        }
    });
});

router.delete("/admin/usuario/excluir/:id", autenticacao, (req, res) => {
    var id = req.params.id;
    global.db.UsuarioPorId(id, (erro, result) => {
        if (erro) {
            return console.log(erro);
        }
        if (result.length == 0) {
            return res
                .status(200)
                .json({
                    erro: true,
                    mensagem: "Nenhum usuário cadastrado com esse ID"
                });
        }
        global.db.deletarUsuario(id, error => {
            if (error) {
                return console.log(error);
            }
            return res
                .status(200)
                .json({
                    erro: false,
                    mensagem: "Usuário excluido com sucesso !!"
                });
        });
    });
});

router.post("/admin/usuario/login", (req, res) => {
    let usuario = req.body.usuario;
    let senha = req.body.senha;
    let erro = [];
    if (!usuario || usuario == null) {
        erro.push("Usuário está vazio");
    }
    if (!senha || senha == null) {
        erro.push("Senha está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).json({ erro: true, mensagem: erro });
    }

    global.db.loginUsuario(usuario, (erro, result) => {
        if (erro) {
            console.log(erro);
        }
        if (result.length == 0) {
            return res
                .status(400)
                .json({ erro: true, mensagem: "Usuário ou senha incorreto !" });
        } else {
            var resultado = result;
            bcrypt.compare(senha, result[0].senha, (erro, result) => {
                if (erro) {
                    return res.status(400).json(erro);
                }
                if (!result) {
                    return res
                        .status(400)
                        .json({
                            erro: true,
                            mensagem: "Senha errada. Tente novamente !"
                        });
                } else {
                    const token = jwt.sign(
                        {
                            usuario: resultado[0].usuario,
                            matricula: resultado[0].matricula,
                            email: resultado[0].email,
                            cargo: resultado[0].cargo
                        },
                        process.env.JWT_KEY,
                        { expiresIn: "2h" }
                    );
                    return res
                        .status(200)
                        .json({ erro: false, resultado, token: token });
                }
            });
        }
    });
});

router.post("/admin/usuario/enviarcodigo", (req, res) => {
    let id = req.body._id;
    let codigo;
    let erro = [];
    if (!id || id == null) {
        erro.push("O ID está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).json({ erro: true, mensagem: erro });
    }
    codigo = Math.round(Math.random() * 999999);
    global.db.UsuarioPorId(id, (erro, result) => {
        if (erro) {
            res.status(400).json(erro);
        } else {
            if (result.length > 0) {
                client.sms
                    .enviar(
                        result[0].telefone,
                        "Seu código de validação é: " + codigo
                    )
                    .then(response => {
                        res.status(200).json({
                            mensagem: "Código enviado com sucesso !!",
                            codigo,
                            resposta: response
                        });
                    })
                    .catch(error => {
                        res.status(400).json(error);
                    });
            } else {
                res.status(400).json({
                    erro: true,
                    mensagem: "Nenhum usuário encontrado com esse ID"
                });
            }
        }
    });
});

router.post("/admin/usuario/recuperar", (req, res) => {
    let email = req.body.email;
    let usuario = req.body.usuario;
    let senha = req.body.senha;
    let senha1 = req.body.senha1;
    let codigo = parseInt(req.body.codigo);
    let codigoDigitado = parseInt(req.body.codigoDigitado);
    let erro = [];
    if (!email || email == null) {
        erro.push("E-mail está vazio");
    }
    if (!usuario || usuario == null) {
        erro.push("Usuário está vazio");
    }
    if (!senha || senha == null) {
        erro.push("Senha está vazio");
    }
    if (!senha1 || senha1 == null) {
        erro.push("Confirme a sua senha");
    }
    if (senha != senha1) {
        erro.push("As senhas digitadas são diferentes !");
    }
    if (!codigo || codigo == null) {
        erro.push("Código de validação está vazio");
    }
    if (codigoDigitado != codigo) {
        erro.push("O código de validação está incorreto !");
    }
    if (erro.length > 0) {
        return res.status(400).json({ erro: true, mensagem: erro });
    }
    global.db.verificaUsuario(email, usuario, (erro, result) => {
        if (erro) {
            console.log(erro);
        }
        if (result.length == 0) {
            res.status(400).json({
                erro: true,
                mensagem: "Nenhum usuário encontrado com esse usuário e e-mail"
            });
        } else {
            global.db.recuperarUsuario({ usuario, email, senha }, erro => {
                if (erro) {
                    console.log(erro);
                } else {
                    return res
                        .status(200)
                        .json({
                            erro: false,
                            mensagem: "Senha alterada com sucesso !!"
                        });
                }
            });
        }
    });
});

router.put("/admin/usuario/editar/:id", autenticacao, (req, res) => {
    var id = req.params.id;
    var usuario = req.body.usuario;
    var matricula = req.body.matricula;
    var senha = req.body.senha;
    var senha2 = req.body.senha2;
    var email = req.body.email;
    var cargo = req.body.cargo;
    var nome = req.body.nome;

    var erro = [];
    if (!usuario || usuario == null) {
        erro.push("Usuário está vazio");
    }
    if (!matricula || matricula == null) {
        erro.push("A matricula está vazio");
    }
    if (!senha || senha == null) {
        erro.push("A senha está vazio");
    }
    if (senha != senha2) {
        erro.push("A senhas são diferentes");
    }
    if (!email || email == null) {
        erro.push("O email está vazio");
    }
    if (!cargo || cargo == null) {
        erro.push("O cargo está vazio");
    }
    if (!nome || nome == null) {
        erro.push("O nome está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).send({ error: true, mensagem: erro });
    }
    global.db.UsuarioPorId(id, (erro, result) => {
        if (erro) {
            return console.log(erro);
        }
        if (result.length == 0) {
            return res
                .status(200)
                .json({ erro: false, mensagem: "Não existe esse ID" });
        }
        global.db.atualizarUsuario(
            id,
            { usuario, matricula, senha, email, cargo, nome },
            error => {
                if (error) {
                    return console.log(error);
                }
                return res
                    .status(200)
                    .json({
                        erros: false,
                        mensagem: "Usuário editado com sucesso !!"
                    });
            }
        );
    });
});
module.exports = router;
