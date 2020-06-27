var connection = require("mongodb").MongoClient;
var Id =  require("mongodb").ObjectId;

connection.connect(`mongodb+srv://admin:${process.env.passBanco}@master-jtbmc.mongodb.net/test?retryWrites=true&w=majority`,{useUnifiedTopology: true})
    .then(conn => global.conn = conn.db("almoxarifado"))
    .catch(error => console.log(error))
    
/*                      FUNÇÕES DA MAQUINA                              */
function findMaquinaforRelatorio(data1,data2,callback){
    global.conn.collection("maquina").find({ data_aquisicao:{
        $gte: data1,
        $lte: data2
    }}).toArray(callback);
}
function inserirMaquina (empresa, callback){
    global.conn.collection("maquina").insertOne(empresa, callback);
}
function findMaquina(callback){
    global.conn.collection("maquina").find({}).sort({id_propietario:1}).toArray(callback);

}
function atualizarMaquina(id, maquina, callback){
    global.conn.collection("maquina").updateOne({_id: new Id(id)},
                                                     {$set:{
                                                        id_proprietario: maquina.id_proprietario,
                                                        chassi: maquina.chassi,
                                                        marca: maquina.marca,
                                                        modelo: maquina.modelo,
                                                        ano: maquina.ano,
                                                        data_aquisicao: maquina.data_aquisicao,
                                                        nf: maquina.nf,
                                                        tipo_maquina: maquina.tipo_maquina
                                                        
                                                     }
                                                     }, callback)
}
function maquinaPorId(id, callback){
    global.conn.collection("maquina").find({_id:new Id(id)}).toArray(callback);
}
function deletarMaquina(id, callback){
    global.conn.collection("maquina").deleteOne({_id:new Id(id)}, callback);
}
/*                          FUNÇÕES DO USUARIO                          */


function inserirUsuario (usuario, callback){
    global.conn.collection("usuario").insertOne(usuario, callback);
}
function findUsuario(callback){
    global.conn.collection("usuario").find({}).sort({nome_usuario:1}).toArray(callback);

}
function loginUsuario(usuario, callback){
    global.conn.collection("usuario").find({usuario:usuario}).toArray(callback)
}
function verificaUsuario(email,usuario, callback){
    global.conn.collection("usuario").find({email:email,usuario:usuario}).toArray(callback)
}

function recuperarUsuario(usuario,callback){
    global.conn.collection("usuario").updateOne({usuario:usuario.usuario, email:usuario.email},
                                                     {$set:{
                                                        senha:usuario.senha
                                                     }
                                                     }, callback)
}
function atualizarUsuario(id, usuario, callback){
    global.conn.collection("usuario").updateOne({_id: new Id(id)},
                                                     {$set:{
                                                        nome_usuario: usuario.nome_usuario,
                                                        matricula: usuario.matricula,
                                                        senha: usuario.senha,
                                                        email: usuario.email,
                                                        cargo: usuario.cargo,
                                                        nome: usuario.nome
                                                        
                                                     }
                                                     }, callback)
}
function UsuarioPorId(id, callback){
    global.conn.collection("usuario").find({_id:new Id(id)}).toArray(callback);
}
function deletarUsuario(id, callback){
    global.conn.collection("usuario").deleteOne({_id:new Id(id)}, callback);
}

/*                      FUNÇÕES DAS PEÇAS                             */
function inserirPeca(empresa, callback){
    global.conn.collection("peca").insertOne(empresa, callback);
}
function findPeca(callback){
    global.conn.collection("peca").find({}).sort({codigo_peca:1}).toArray(callback);

}
function findPecaCodigo(codigo,callback){
    global.conn.collection("peca").find({ codigo_peca: codigo }).toArray(callback);
}
function findPecaforRelatorio(data1,data2,callback){
    global.conn.collection("peca").find({ data_entrada:{
        $gte: data1,
        $lte: data2
    }}).toArray(callback);
}

function atualizarPeca(id, peca, callback){
    global.conn.collection("peca").updateOne({_id: new Id(id)},
                                                     {$set:{
                                                        nome_peca: peca.nome_peca,
                                                        codigo_peca: peca.codigo_peca,
                                                        nome_fornecedor: peca.nome_fornecedor,
                                                        locacao: peca.locacao,
                                                        nf: peca.nf,
                                                        data_entrada: peca.data_entrada,
                                                        fabricante: peca.fabricante,
                                                        quantidade:peca.quantidade,
                                                        valor_peca:peca.valor_peca
                                                    }}, callback)
}
function atualizarPecaPorCodigo(codigo, peca, callback){
    global.conn.collection("peca").updateOne({codigo_peca:codigo},
                                                     {$set:{
                                                        nome_peca: peca.nome_peca,
                                                        codigo_peca: peca.codigo_peca,
                                                        nome_fornecedor: peca.nome_fornecedor,
                                                        locacao: peca.locacao,
                                                        nf: peca.nf,
                                                        data_entrada: peca.data_entrada,
                                                        fabricante: peca.fabricante,
                                                        quantidade:peca.quantidade,
                                                        valor_peca:peca.valor_peca
                                                    }}, callback)
}
function pecaPorId(id, callback){
    global.conn.collection("peca").find({_id:new Id(id)}).toArray(callback);
}
function pecaPorCodigo(codigo, callback){
    global.conn.collection("peca").find({codigo_peca:codigo}).toArray(callback);
}
function atualizarQuantidadePeca(id,quantidade, callback){
    global.conn.collection("peca").updateOne({_id:new Id(id)},{$set:{quantidade:quantidade}}, callback);
}
function deletarPeca(id, callback){
    global.conn.collection("peca").deleteOne({_id:new Id(id)}, callback);
}

/*                         FUNCÕES DO FORNECEDOR                       */

function inserirFornecedor(fornecedor, callback){
    global.conn.collection("fornecedor").insertOne(fornecedor, callback);
}
function findFornecedor(callback){
    global.conn.collection("fornecedor").find({}).sort({codigo_peca:1}).toArray(callback);

}
function atualizarFornecedor(id, fornecedor, callback){
    global.conn.collection("fornecedor").updateOne({_id: new Id(id)},
                                                     {$set:{
                                                    razao_social : fornecedor.razao_social,
                                                    nome_fantasia : fornecedor.nome_fantasia,
                                                    cnpj : fornecedor.cnpj,
                                                    inscricao_estadual : fornecedor.inscricao_estadual,
                                                    endereco : fornecedor.endereco,
                                                    telefone : fornecedor.telefone,
                                                        
                                                    }}, callback)
}
function fornecedorPorId(id, callback){
    global.conn.collection("fornecedor").find({_id:new Id(id)}).toArray(callback);
}
function deletarFornecedor(id, callback){
    global.conn.collection("fornecedor").deleteOne({_id:new Id(id)}, callback);
}

/*                         FUNÇÕES DA OS                                 */

function QuantidadeOs(callback){
    global.conn.collection("os").find({}).count({},callback)

}
function QuantidadeOsMaquina(id_propietario, callback){
    global.conn.collection("os").distinct("estado",callback)

}
function inserirOs(os, callback){
    global.conn.collection("os").insertOne(os, callback);
}
function findOs(callback){
    global.conn.collection("os").find({}).sort({codigo_peca:1}).toArray(callback);

}

function findOsforRelatorio(data1,data2,callback){
    global.conn.collection("os").find({ data_abertura:{
        $gte: data1,
        $lte: data2
    }}).toArray(callback);
}

function atualizarOs(id, os, callback){
    global.conn.collection("os").updateOne({_id: new Id(id)},
                                                     {$set:{
                                                    estado: os.estado,
                                                    data_encerramento: os.data_encerramento,     
                                                    }}, callback)
}
function atualizarOsPeca(id, peca, callback){
    global.conn.collection("os").updateOne({_id: new Id(id)},
    {$addToSet:{peca:{$each:[peca]}}}, callback)
}
function OsPorIdMaquina(idProprietario, callback){
    global.conn.collection("os").find({"maquina.id_proprietario":idProprietario}).toArray(callback);
}
function OsPorId(id, callback){
    global.conn.collection("os").find({_id: new Id(id)}).toArray(callback);
}
function quantidadeOSMeses(pesquisar, callback){
    global.conn.collection("os").find({data_abertura:{
        $lte: pesquisar
    } }).count({},callback)
}
module.exports = { findPecaCodigo, inserirMaquina, findMaquina, atualizarMaquina, maquinaPorId, deletarMaquina,findMaquinaforRelatorio, 
                    inserirUsuario, findUsuario, atualizarUsuario,verificaUsuario,loginUsuario, UsuarioPorId, deletarUsuario,recuperarUsuario,
                    inserirPeca, findPeca, findPecaforRelatorio, atualizarPeca, pecaPorId, deletarPeca,
                    inserirFornecedor, findFornecedor, atualizarFornecedor, fornecedorPorId, deletarFornecedor,
                    inserirOs, findOs, findOsforRelatorio, atualizarOs, OsPorId, OsPorIdMaquina, atualizarOsPeca,atualizarQuantidadePeca,QuantidadeOs,quantidadeOSMeses,QuantidadeOsMaquina,
                    pecaPorCodigo,atualizarPecaPorCodigo
                }