var express = require('express');
var router = express.Router();
const autenticacao = require('../middlware/autenticação')
/*                                ROTAS DO FORNECEDOR                                     */

router.get('/fornecedor', autenticacao, (req,res)=>{
    global.db.findFornecedor((error,result)=>{
      if(error){
        return console.log(error);
      }
      if(result.length == 0){
        return res.status(200).json({erro:false, mensagem:"Nenhum fornecedor cadastrado !!"})
      }
      res.status(200).json({erro:false, dados: result})
    })
  
  })
  
  router.post('/admin/fornecedor/novo',autenticacao, (req,res)=>{
    var razao_social = req.body.razao_social;
    var nome_fantasia = req.body.nome_fantasia;
    var cnpj = req.body.cnpj;
    var inscricao_estadual = req.body.inscricao_estadual;
    var endereco = req.body.endereco;
    var telefone = req.body.telefone;
    var email = req.body.email;
  
    var erro = [];
    if(!razao_social || razao_social == null){
      erro.push("O nome da razão social está vazio");
    }
    if(!nome_fantasia || nome_fantasia == null){
      erro.push("O nome fantasia está vazio");
    }
    if(!cnpj  || cnpj == null){
      erro.push("O CNPJ está vazio");
    }
    if(!inscricao_estadual  || inscricao_estadual == null){
      erro.push("A inscrição social está vazio");
    }
    if(!endereco || endereco == null){
      erro.push("O endereço está vazio");
    }
    if(!telefone || telefone == null){
      erro.push("O telefone está vazio");
    }
    if(!email || email == null){
      erro.push("O email está vazio");
    }
    if(erro.length>0){
      return res.status(400).json({error:true, mensagem:erro})
    }
        global.db.inserirFornecedor({razao_social, nome_fantasia, cnpj, inscricao_estadual, endereco, telefone, email}, (error) =>{
        if(error){
          return console.log(error);
        }
        return res.status(201).json({erro:false, mensagem:"Fornecedor criado com sucesso !!"});
      })
    })
  
  router.delete('/admin/fornecedor/excluir/:id',autenticacao, (req,res)=>{
    var id = req.params.id;
    global.db.fornecedorPorId(id, (erro,result)=>{
      if(erro){
        return console.log(erro);
      }
      if(result.length == 0){
        return res.status(200).json({erro:true , mensagem:"Nenhum fornecedor com esse ID"})
      }
    global.db.deletarFornecedor(id,(error)=>{
      if(error){
        return console.log(error)
      }
      res.status(200).json({erro:false, mensagem:"Fornecedor excluido com sucesso !!"})
    })
  })
  })
  
  router.put('/admin/fornecedor/editar/:id',autenticacao, (req, res)=>{
    var id = req.params.id
    var razao_social = req.body.razao_social;
    var nome_fantasia = req.body.nome_fantasia;
    var cnpj = req.body.cnpj;
    var inscricao_estadual = req.body.inscricao_estadual;
    var endereco = req.body.endereco;
    var telefone = req.body.telefone;
    var email = req.body.email;
  
    var erro = [];
    if(!razao_social || razao_social == null){
      erro.push("O nome da razão social está vazio");
    }
    if(!nome_fantasia || nome_fantasia == null){
      erro.push("O nome fantasia está vazio");
    }
    if(!cnpj  || cnpj == null){
      erro.push("O CNPJ está vazio");
    }
    if(!inscricao_estadual  || inscricao_estadual == null){
      erro.push("A inscrição social está vazio");
    }
    if(!endereco || endereco == null){
      erro.push("O endereço está vazio");
    }
    if(!telefone || telefone == null){
      erro.push("O telefone está vazio");
    }
    if(!email || email == null){
      erro.push("O telefone está vazio");
    }
    if(erro.length>0){
      return res.status(400).json({error:true, mensagem:erro})
    }
    global.db.fornecedorPorId(id, (erro,result)=>{
      if(erro){
        return console.log(erro);
      }
      if(result.length == 0){
        return res.status(200).json({erro:true , mensagem:"Nenhum fornecedor com esse ID"})
      }
    global.db.atualizarFornecedor(id,{razao_social, nome_fantasia, cnpj, inscricao_estadual, endereco, telefone, email}, (error) =>{
      if(error){
        return console.log(error);
      }res.status(200).json({erro:false, mensagem:"Fornecedor editado com sucesso !!"});
    })
  })
  })

module.exports = router;