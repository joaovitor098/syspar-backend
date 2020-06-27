var express = require("express");
var router = express.Router();
const autenticacao = require("../middlware/autenticação");
// ROTAS PEÇAS

router.get("/peca", autenticacao, (req, res) => {
    global.db.findPeca((error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result.length == 0) {
            return res
                .status(200)
                .json({ erro: false, mensagem: "Nenhuma peça cadastrada" });
        }
        res.status(200).json({ erros: false, dados: result });
    });
});

router.post("/admin/peca/relatorio",  autenticacao,(req, res) => {
    var data1 = req.body.dataPeca1;
    var data2 = req.body.dataPeca2;
    var erro = [];
    if (!data1 || data1 == null) {
        erro.push("Data 1 vazia");
    }
    if (!data2 || data2 == null) {
        erro.push("Data 2 vazia");
    }
    if (erro.length > 0) {
        res.status(400).json({ erro: true, mensagem: erro });
    }
    console.log("dataPeca 1: " + data1 + " / " + " dataPeca2: " + data2);
    global.db.findPecaforRelatorio(data1, data2, (erro, result) => {
        if (erro) {
            return res.status(400).json(erro);
        } else {
            return res.status(200).json({ error: false, dados: result });
        }
    });
});

router.post("/admin/peca/nova", autenticacao, (req, res) => {
    var nome_peca = req.body.nome_peca;
    var codigo_peca = req.body.codigo_peca;
    var nome_fornecedor = req.body.nome_fornecedor;
    var locacao = req.body.locacao;
    var nf = req.body.nf;
    var data_entrada = req.body.data_entrada;
    var fabricante = req.body.fabricante;
    var quantidade = parseInt(req.body.quantidade);
    var valor_peca = req.body.valor_peca;

    var erro = [];
    if (!nome_peca || nome_peca == null) {
        erro.push("Nome da peça está vazio");
    }
    if (!codigo_peca || codigo_peca == null) {
        erro.push("O código da peça está vazio");
    }
    if (!nome_fornecedor || nome_fornecedor == null) {
        erro.push("O nome do fornecedor está vazio");
    }
    if (!locacao || locacao == null) {
        erro.push("A locação está vazio");
    }
    if (!nf || nf == null) {
        erro.push("A nota fiscal está vazio");
    }
    if (!data_entrada || data_entrada == null) {
        erro.push("A data de entrada está vazio");
    }
    if (!fabricante || fabricante == null) {
        erro.push("O fabricante está vazio");
    }
    if (!quantidade || quantidade == null) {
        erro.push("A quantidade está vazio");
    }
    if (!valor_peca || valor_peca == null) {
        erro.push("A quantidade de peça está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).json({ error: true, mensagem: erro });
    }

    global.db.pecaPorCodigo(codigo_peca, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length == 0) {
                global.db.inserirPeca(
                    {
                        nome_peca,
                        codigo_peca,
                        nome_fornecedor,
                        locacao,
                        nf,
                        data_entrada,
                        fabricante,
                        quantidade,
                        valor_peca
                    },
                    error => {
                        if (error) {
                            return console.log(error);
                        }
                        return res
                            .status(201)
                            .json({
                                erro: false,
                                mensagem: "Peça inserida com sucesso !!"
                            });
                    }
                );
            } else {
                global.db.atualizarPecaPorCodigo(
                    codigo_peca,
                    {
                        nome_peca,
                        codigo_peca,
                        nome_fornecedor,
                        locacao,
                        nf,
                        data_entrada,
                        fabricante,
                        quantidade,
                        valor_peca
                    },
                    error => {
                        if (error) {
                            return console.log(error);
                        }
                        return res
                            .status(202)
                            .json({
                                erro: false,
                                mensagem: "Peça atualizada com sucesso !!"
                            });
                    }
                );
            }
        }
    });
});

router.put("/admin/peca/editar/:id", autenticacao, (req, res) => {
    var id = req.params.id;
    var nome_peca = req.body.nome_peca;
    var codigo_peca = req.body.codigo_peca;
    var nome_fornecedor = req.body.nome_fornecedor;
    var locacao = req.body.locacao;
    var nf = req.body.nf;
    var data_entrada = req.body.data_entrada;
    var fabricante = req.body.fabricante;
    var quantidade = parseInt(req.body.quantidade);
    var valor_peca = req.body.valor_peca;

    var erro = [];
    if (!nome_peca || nome_peca == null) {
        erro.push("Nome da peça está vazio");
    }
    if (!codigo_peca || codigo_peca == null) {
        erro.push("O código da peça está vazio");
    }
    if (!nome_fornecedor || nome_fornecedor == null) {
        erro.push("O nome do fornecedor está vazio");
    }
    if (!locacao || locacao == null) {
        erro.push("A locação está vazio");
    }
    if (!nf || nf == null) {
        erro.push("A nota fiscal está vazio");
    }
    if (!data_entrada || data_entrada == null) {
        erro.push("A data de entrada está vazio");
    }
    if (!fabricante || fabricante == null) {
        erro.push("O fabricante está vazio");
    }
    if (!quantidade || quantidade == null) {
        erro.push("A quantidade está vazio");
    }
    if (!valor_peca || valor_peca == null) {
        erro.push("A quantidade de peça está vazio");
    }
    if (erro.length > 0) {
        return res.status(400).json({ error: true, mensagem: erro });
    }
    global.db.pecaPorId(id, (erro, result) => {
        if (erro) {
            return console.log(erro);
        }
        if (result.length == 0) {
            return res
                .status(400)
                .json({
                    erro: true,
                    mensagem: "Nenhuma peça cadastrada com esse ID"
                });
        }
        global.db.atualizarPeca(
            id,
            {
                nome_peca,
                codigo_peca,
                nome_fornecedor,
                locacao,
                nf,
                data_entrada,
                fabricante,
                quantidade,
                valor_peca
            },
            error => {
                if (error) {
                    return console.log(error);
                }
                return res
                    .status(202)
                    .json({
                        erro: false,
                        mensagem: "Peça editada com sucesso !!"
                    });
            }
        );
    });
});

router.delete("/admin/peca/excluir/:id", autenticacao, (req, res) => {
    var id = req.params.id;
    global.db.pecaPorId(id, (erro, result) => {
        if (erro) {
            return console.log(erro);
        }
        if (result.length == 0) {
            return res
                .status(200)
                .json({
                    erro: true,
                    mensagem: "Nenhuma peça cadastrada com esse ID"
                });
        }
        global.db.deletarPeca(id, erro => {
            if (erro) {
                return console.log(erro);
            }
        });
        return res
            .status(200)
            .json({ erro: false, mensagem: "Peça excluida com sucesso !!" });
    });
});

router.post("/admin/peca/requisicao",  autenticacao,(req, res) => {
    var _id = req.body._id;
    var codigo_peca = req.body.codigo_peca;
    var nome_peca = req.body.nome_peca;
    var quantidade = parseInt(req.body.quantidade);
    var idOs = req.body.idOs;
    var erro = [];

    if (!_id || _id == null) {
        erro.push("ID da peça está vazio");
    }
    if (!codigo_peca || codigo_peca == null) {
        erro.push("O código da peça está vazio");
    }
    if (!nome_peca || nome_peca == null) {
        erro.push("O nome da peça está vazio");
    }
    if (!quantidade || quantidade == null) {
        erro.push("A quantidade está vazio");
    }
    if (!idOs || idOs == null) {
        erro.push("O ID da OS está vazio");
    }
    if (erro.length > 0) {
        res.status(400).json({ error: true, mensagem: erro });
    }

    global.db.pecaPorId(_id, (erro, result) => {
        if (erro) {
            console.log(erro);
        } else {
            if (result.length == 0) {
                res.status(400).json({
                    erro: true,
                    mensagem: "Nenhuma peça cadastrada com esse ID"
                });
            } else {
                if (result[0].quantidade < quantidade) {
                    res.status(400).json({
                        erro: true,
                        mensagem:
                            "Quantidade em estoque é inferior ao que foi solicitado"
                    });
                } else {
                    var resultado = result[0].quantidade - quantidade;
                    global.db.atualizarQuantidadePeca(_id, resultado, erro => {
                        if (erro) {
                            console.log(erro);
                        } else {
                            global.db.atualizarOsPeca(
                                idOs,
                                { codigo_peca, nome_peca, quantidade },
                                erro => {
                                    if (erro) {
                                        console.log(erro);
                                    } else {
                                        res.status(201).json({
                                            erro: false,
                                            mensagem:
                                                "Peça inserida na OS de numero " +
                                                idOs +
                                                " com sucesso !!"
                                        });
                                    }
                                }
                            );
                        }
                    });
                }
            }
        }
    });
});
module.exports = router;
