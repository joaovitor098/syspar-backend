var express = require('express');
var router = express.Router();
const autenticacao = require('../middlware/autenticação')


router.get('/maquina', autenticacao,(req, res) => {
  global.db.findMaquina((error, result) => {
    if(error){
      return console.log(error)
    }
    if(result.length == 0){
      return res.status(200).json({erro:false, mensagem:"Nenhuma máquina cadastrada !!"})
    }
    
    return res.status(200).json({dados: result, error: false})
  });
});

router.post('/admin/maquina/relatorio', autenticacao, (req,res)=>{
  var data1 = req.body.dataMaquina1
  var data2 = req.body.dataMaquina2
  var erro = [];
  if(!data1 || data1 == null){
    erro.push("Data 1 vazia")
  }
  if(!data2 || data2== null){
    erro.push("Data 2 vazia")
  }
  if(erro.length > 0){
    res.status(400).json({erro:true, mensagem:erro})
  }
  console.log("data 1: "+ data1 + " / "+" data2: " + data2)
  global.db.findMaquinaforRelatorio(data1, data2,(erro,result)=>{
      if(erro){
      return res.status(400).json(erro)
      }else{
        return  res.status(200).json({error: false,dados: result})
      } 
    })
});

router.post('/admin/maquina/nova', autenticacao, (req, res) =>{
  //recuperando os dados do form
  var id_proprietario = req.body.id_proprietario;
  var chassi = req.body.chassi;
  var marca = req.body.marca;
  var modelo = req.body.modelo;
  var ano = parseInt(req.body.ano);
  var data_aquisicao = req.body.data_aquisicao;
  var nf = req.body.nf;
  var tipo_maquina = req.body.tipo_maquina;

  var erro =[];

    if(!id_proprietario || id_proprietario == null){
      erro.push("Id do proprietário está vazio");
    }
    if(!chassi || chassi == null){
      erro.push("Chassi está vazio");
    }
    if(!marca  || marca == null){
      erro.push("Marca está vazio");
    }
    if(!modelo  || modelo == null){
      erro.push("Modelo está vazio");
    }
    if(!ano || ano == null){
      erro.push("Ano está vazio");
    }
    if(!data_aquisicao || data_aquisicao == null){
      erro.push("Data de aquisicao está vazio")
    }
    if(!nf || nf == null){
      erro.push("Nota fiscal está vazio");
    }
    if(!tipo_maquina || tipo_maquina == null){
      erro.push("Tipo de maquina está vazio");
    }
    if(erro.length>0){
      return res.status(400).send({error:true, mensagem:erro})
    }
  global.db.inserirMaquina({id_proprietario, chassi, marca, modelo, ano,data_aquisicao, nf, tipo_maquina}, (error) =>{
    if(error){
     return res.status(400).send({error:true});
    }
    return res.status(201).send({error:false, mensagem:"Máquina cadastrada com sucesso !!"});
  })
});

router.put('/admin/maquina/editar/:id',  autenticacao,(req, res)=>{
  var id = req.params.id
  var id_proprietario = req.body.id_proprietario;
  var chassi = req.body.chassi;
  var marca = req.body.marca;
  var modelo = req.body.modelo;
  var ano = parseInt(req.body.ano);
  var data_aquisicao = new Date(req.body.data_aquisicao);
  var nf = req.body.nf
  var tipo_maquina = req.body.tipo_maquina;

  var erro =[];

  if(!id_proprietario || id_proprietario == null){
    erro.push("Id do proprietário está vazio");
  }
  if(!chassi || chassi == null){
    erro.push("Chassi está vazio");
  }
  if(!marca  || marca == null){
    erro.push("Marca está vazio");
  }
  if(!modelo  || modelo == null){
    erro.push("Modelo está vazio");
  }
  if(!ano || ano == null){
    erro.push("Ano está vazio");
  }
  if(!data_aquisicao || data_aquisicao == null){
    erro.push("Data de aquisicao está vazio")
  }
  if(!nf || nf == null){
    erro.push("Nota fiscal está vazio");
  }
  if(!tipo_maquina || tipo_maquina == null){
    erro.push("Tipo de maquina está vazio");
  }
  if(erro.length>0){
    return res.status(400).send({error:true, mensagem:erro})
  }

  global.db.maquinaPorId(id, (erro, result)=>{
    if(erro){
      return console.log(erro)
    }
    if(result.length == 0){
      return res.status(200).json({erro:false, mensagem:"Não existe esse ID"})
    }
    global.db.atualizarMaquina(id,{id_proprietario, chassi, marca, modelo, ano, data_aquisicao, nf, tipo_maquina}, (error) =>{
      if(error){
        return console.log(error);
      }
      return res.status(200).json({error: false, mensagem:"Máquina editada com sucesso !!"});
    })
  })
})

router.delete('/admin/maquina/excluir/:id', autenticacao,(req,res)=>{
  var id = req.params.id;
  global.db.maquinaPorId(id, (erro, result)=>{
    if(erro){
      return console.log(erro)
    }
    if(result.length == 0){
      return res.status(200).json({erro:false, mensagem:"Não existe máquina com esse ID"})
    }
    global.db.deletarMaquina(id, (error) =>{
      if(error){
        return console.log(error);
      }
      return res.status(200).json({error: false, mensagem:"Máquina excluida com sucesso !!"});
    })
  })
})
module.exports = router;