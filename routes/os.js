var express = require('express');
var router = express.Router();
const autenticacao = require('../middlware/autenticação');

// ROTAS OS

router.get('/os', autenticacao, (req,res)=>{
    global.db.findOs((error,result)=>{
      if(error){
        return console.log(error);
      }
      if(result.length == 0){
        return res.status(200).json({erro:false, mensagem:"Nenhuma OS cadastrada"})
      }
      res.status(200).json({erros:false, dados:result})
    })
  
  });

  router.post('/admin/os/relatorio',  autenticacao,(req,res)=>{
    var data1 = req.body.dataOs1
    var data2 = req.body.dataOs2
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
    console.log("dataOS 1: "+ data1 + " / "+" dataOS 2: " + data2)
    global.db.findOsforRelatorio(data1, data2,(erro,result)=>{
        if(erro){
        return res.status(400).json(erro)
        }else{
          return  res.status(200).json({error: false,dados: result})
        } 
      })
  });

  router.post('/admin/os/nova', autenticacao, (req,res)=>{
    var horas_trabalhadas = parseInt(req.body.horas_trabalhadas);
    var descricao =  req.body.descricao;
    /*maquina*/
    var marca =  req.body.marca;
    var modelo =  req.body.modelo;
    var data_aquisicao =  req.body.data_aquisicao;
    var chassi =  req.body.chassi;
    var ano =  req.body.ano;
    var _idMaquina =  req.body._id;
    var id_proprietario =  req.body.id_proprietario;
    var estado = "Aberta";


    var date = new Date()

    var data = new Date()
    data.setDate(date.getDate())
    var mes = ("0" + (data.getMonth() + 1)).slice(-2); 
    var data_abertura =  data.getFullYear()+"-"+mes+"-"+data.getDate()
    var data_encerramento = ""

    var erro = [];
    if(!horas_trabalhadas || horas_trabalhadas == null){
      erro.push("As horas trabalhadas está vazio");
    }
    if(!id_proprietario || id_proprietario == null){
      erro.push("A identificação da máquina está vazia");
    }
    if(!descricao  || descricao == null){
      erro.push("A descrição está vazio");
    }
    if(!marca  || marca == null){
      erro.push("A marca está vazio");
    }
    if(!modelo || modelo == null){
      erro.push("O modelo está vazio");
    }
    if(!data_aquisicao || data_aquisicao == null){
      erro.push("A data de aquisição vazio");
    }
    if(!chassi || chassi == null){
      erro.push("O chassi está vazio");
    }
    if(!ano || ano == null){
      erro.push("O ano está vazio")
    }
    if(!_idMaquina || _idMaquina == null){
      erro.push("O ID da máquina está vazio")
    }
    if(erro.length>0){
      return res.status(400).json({error:true, mensagem:erro})
    }
    
    global.db.OsPorIdMaquina(id_proprietario, (error,result)=>{
      if(error){
        console.log(error)
      }else{
        if(result.length == 0){
          global.db.QuantidadeOs((err,result)=>{
            if(err){
              console.log(err)
            }else{ 
              let resultado 
              resultado = {result:result+1}
              let numeroOS = resultado.result
              global.db.inserirOs({numeroOS,horas_trabalhadas, descricao, estado, data_abertura , data_encerramento, maquina:[{_idMaquina,marca,modelo,data_aquisicao,chassi,ano,id_proprietario}]}, (error) =>{
                if(error){
                  return console.log(error);
                }
                return res.status(201).json({erro:false, mensagem:"OS inserida com sucesso !!"});
              })
            }
          })
        }
        else{
            if(result[0].horas_trabalhadas > horas_trabalhadas){
              erro.push("Último registro de horas trabalhadas dessa máquina está superior ao que foi digitado")
              return res.status(400).json({erro:true, mensagem:erro});
            }
            else{
              global.db.QuantidadeOs((err,result)=>{
                if(err){
                  console.log(err)
                }else{ 
                  let resultado 
                  resultado = {result:result+1}
                  let numeroOS = resultado.result
                  global.db.inserirOs({numeroOS, horas_trabalhadas, descricao, estado, data_abertura , data_encerramento ,maquina:[{_idMaquina,marca,modelo,data_aquisicao,chassi,ano,id_proprietario}]}, (error) =>{
                    if(error){
                      return console.log(error);
                    }
                    return res.status(201).json({erro:false, mensagem:"OS inserida com sucesso !!"});
                  })
                }
              })
            }
          }
      } 
    }) 
  });
  
  router.put('/admin/os/fechar/:id', autenticacao, (req, res)=>{
    var id = req.params.id
    var estado = "Fechada";


    var date = new Date()

    var data = new Date()
    data.setDate(date.getDate())
     var meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro")
    var data_encerramento = data.getDate()+" de "+meses[data.getMonth()]+ " de "+data.getFullYear()
    var erro = [];

    if(erro.length>0){
      return res.status(400).json({error:true, mensagem:erro})
    }
    global.db.OsPorId(id, (erro, result)=>{
      if(erro){
        return console.log(erro);
      }
      if(result.length == 0){
        return res.status(400).json({erro:true, mensagem:"Nenhuma OS cadastrada com esse ID: "+id})
      }
      global.db.atualizarOs(id,{estado,data_encerramento}, (error) =>{
        if(error){
          return console.log(error);
        }return res.status(202).json({erro:false, mensagem:"OS editada com sucesso !!"});
      })
    })
  });
  router.put('/admin/os/cancelar/:id', autenticacao,(req, res)=>{
    var id = req.params.id
    var estado = "Cancelada";

    var date = new Date()

    var data = new Date()
    data.setDate(date.getDate())
     var meses = new Array("Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro")
    var data_encerramento = data.getDate()+" de "+meses[data.getMonth()]+ " de "+data.getFullYear()
    var erro = [];

    if(erro.length>0){
      return res.status(400).json({error:true, mensagem:erro})
    }
    global.db.OsPorId(id, (erro, result)=>{
      if(erro){
        return console.log(erro);
      }
      if(result.length == 0){
        return res.status(200).json({erro:true, mensagem:"Nenhuma OS cadastrada com esse ID"})
      }
      global.db.atualizarOs(id,{estado,data_encerramento}, (error) =>{
        if(error){
          return console.log(error);
        }return res.status(202).json({erro:false, mensagem:"OS editada com sucesso !!"});
      })
    })
  })
  
  router.get('/admin/os/quantidade', autenticacao, (req,res)=>{
      const Janeiro = "2020-01-01";
      const janeiro2 = "2020-01-31";
      const Fevereiro = "2020-02-01";
      const Fevereiro2 = "2020-02-29";
      const Março = "2020-03-01";
      const Março2 = "2020-03-31";
      const Abril = "2020-04-01";
      const Abril2 = "2020-04-30";
      const Maio = "2020-05-01";
      const Maio2 = "2020-05-31";
      const Junho = "2020-06-01";
      const Junho2 = "2020-06-30";
      const Julho = "2020-07-01";
      const Julho2 = "2020-07-31";
      const Agosto = "2020-08-01";
      const Agosto2 = "2020-08-31";
      const Setembro = "2020-09-01";
      const Setembro2 = "2020-09-30";
      const Outubro = "2020-10-01";
      const Outubro2 = "2020-10-31";
      const Novembro = "2020-11-01";
      const Novembro2 = "2020-11-30";
      const Dezembro = "2020-12-01";
      const Dezembro2 = "2020-12-31";

      var array = [];

      global.db.findOsforRelatorio(Janeiro, janeiro2,(erro,result)=>{
          if(erro){
            return console.log("error Janeiro")
          }else{
            array.push({janeiro:  result.length})
            global.db.findOsforRelatorio(Fevereiro, Fevereiro2,(erro,result)=>{
                if(erro){
                  return console.log("error Fevereiro")
                }else{
                   array.push({fevereiro: result.length})
                  global.db.findOsforRelatorio(Março, Março2,(erro,result)=>{
                      if(erro){
                        return console.log("error Março")
                      }else{
                         array.push({marco: result.length})
                        global.db.findOsforRelatorio(Abril, Abril2,(erro,result)=>{
                            if(erro){
                              return console.log("error Abril")
                            }else{
                              array.push({abril: result.length})
                              global.db.findOsforRelatorio(Maio, Maio2,(erro,result)=>{
                                  if(erro){
                                    return console.log("error Maio")
                                  }else{
                                    array.push({maio: result.length})
                                    global.db.findOsforRelatorio(Junho, Junho2,(erro,result)=>{
                                        if(erro){
                                          return console.log("error Junho")
                                        }else{
                                          array.push({junho: result.length})
                                          global.db.findOsforRelatorio(Julho, Julho2,(erro,result)=>{
                                              if(erro){
                                                return console.log("error Julho")
                                              }else{
                                                array.push({julho: result.length})
                                                global.db.findOsforRelatorio(Agosto, Agosto2,(erro,result)=>{
                                                    if(erro){
                                                      return console.log("error Agosto")
                                                    }else{
                                                      array.push({agosto: result.length})
                                                      global.db.findOsforRelatorio(Setembro, Setembro2,(erro,result)=>{
                                                          if(erro){
                                                            return console.log("error Setembro")
                                                          }else{
                                                            array.push({setembro: result.length})
                                                            global.db.findOsforRelatorio(Outubro, Outubro2,(erro,result)=>{
                                                                if(erro){
                                                                  return console.log("error Outubro")
                                                                }else{
                                                                  array.push({outubro: result.length})
                                                                  global.db.findOsforRelatorio(Novembro, Novembro2,(erro,result)=>{
                                                                      if(erro){
                                                                        return console.log("error Novembro")
                                                                      }else{
                                                                        array.push({novembro: result.length})
                                                                          global.db.findOsforRelatorio(Dezembro, Dezembro2,(erro,result)=>{
                                                                              if(erro){
                                                                              return console.log("error Dezembro")
                                                                              }else{
                                                                                array.push({dezembro: result.length})
                                                                                return res.status(200).json(array)
                                                                              } 
                                                                            })
                                                                      } 
                                                                    })
                                                                } 
                                                              })
                                                          } 
                                                        })
                                                    } 
                                                  })
                                              } 
                                            })
                                        } 
                                      })
                                  } 
                                })
                            } 
                          })
                      } 
                    })
                } 
              })
          } 
        })

      });
  
  router.get('/admin/os/osMaquina',  autenticacao,(req,res)=>{
      const Janeiro = "2020-01-01";
      const janeiro2 = "2020-01-31";
      const Fevereiro = "2020-02-01";
      const Fevereiro2 = "2020-02-29";
      const Março = "2020-03-01";
      const Março2 = "2020-03-31";
      const Abril = "2020-04-01";
      const Abril2 = "2020-04-30";
      const Maio = "2020-05-01";
      const Maio2 = "2020-05-31";
      const Junho = "2020-06-01";
      const Junho2 = "2020-06-30";
      const Julho = "2020-07-01";
      const Julho2 = "2020-07-31";
      const Agosto = "2020-08-01";
      const Agosto2 = "2020-08-31";
      const Setembro = "2020-09-01";
      const Setembro2 = "2020-09-30";
      const Outubro = "2020-10-01";
      const Outubro2 = "2020-10-31";
      const Novembro = "2020-11-01";
      const Novembro2 = "2020-11-30";
      const Dezembro = "2020-12-01";
      const Dezembro2 = "2020-12-31";

      var array = [];

      global.db.findMaquinaforRelatorio(Janeiro, janeiro2,(erro,result)=>{
          if(erro){
            return console.log("error Janeiro")
          }else{
            array.push({janeiro:  result.length})
            global.db.findMaquinaforRelatorio(Fevereiro, Fevereiro2,(erro,result)=>{
                if(erro){
                  return console.log("error Fevereiro")
                }else{
                   array.push({fevereiro: result.length})
                  global.db.findMaquinaforRelatorio(Março, Março2,(erro,result)=>{
                      if(erro){
                        return console.log("error Março")
                      }else{
                         array.push({marco: result.length})
                        global.db.findMaquinaforRelatorio(Abril, Abril2,(erro,result)=>{
                            if(erro){
                              return console.log("error Abril")
                            }else{
                              array.push({abril: result.length})
                              global.db.findMaquinaforRelatorio(Maio, Maio2,(erro,result)=>{
                                  if(erro){
                                    return console.log("error Maio")
                                  }else{
                                    array.push({maio: result.length})
                                    global.db.findMaquinaforRelatorio(Junho, Junho2,(erro,result)=>{
                                        if(erro){
                                          return console.log("error Junho")
                                        }else{
                                          array.push({junho: result.length})
                                          global.db.findMaquinaforRelatorio(Julho, Julho2,(erro,result)=>{
                                              if(erro){
                                                return console.log("error Julho")
                                              }else{
                                                array.push({julho: result.length})
                                                global.db.findMaquinaforRelatorio(Agosto, Agosto2,(erro,result)=>{
                                                    if(erro){
                                                      return console.log("error Agosto")
                                                    }else{
                                                      array.push({agosto: result.length})
                                                      global.db.findMaquinaforRelatorio(Setembro, Setembro2,(erro,result)=>{
                                                          if(erro){
                                                            return console.log("error Setembro")
                                                          }else{
                                                            array.push({setembro: result.length})
                                                            global.db.findMaquinaforRelatorio(Outubro, Outubro2,(erro,result)=>{
                                                                if(erro){
                                                                  return console.log("error Outubro")
                                                                }else{
                                                                  array.push({outubro: result.length})
                                                                  global.db.findMaquinaforRelatorio(Novembro, Novembro2,(erro,result)=>{
                                                                      if(erro){
                                                                        return console.log("error Novembro")
                                                                      }else{
                                                                        array.push({novembro: result.length})
                                                                          global.db.findMaquinaforRelatorio(Dezembro, Dezembro2,(erro,result)=>{
                                                                              if(erro){
                                                                              return console.log("error Dezembro")
                                                                              }else{
                                                                                array.push({dezembro: result.length})
                                                                                return res.status(200).json(array)
                                                                              } 
                                                                            })
                                                                      } 
                                                                    })
                                                                } 
                                                              })
                                                          } 
                                                        })
                                                    } 
                                                  })
                                              } 
                                            })
                                        } 
                                      })
                                  } 
                                })
                            } 
                          })
                      } 
                    })
                } 
              })
          } 
        })

  })
  module.exports = router;