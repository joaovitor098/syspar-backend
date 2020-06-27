const express = require("express");
const http = require("http").Server(express);
const io = require("socket.io")(http);

var router = express.Router();

router.get("/dashboard", (req, res) => {
    res.send("socket.io teste");
});

io.on("connection", socket => {
    let id = socket.id;
    console.log("socket conectado: " + id);

    socket.on("increment", counter => {
        console.log("increment");
        io.sockets.emit("COUNTER_INCREMENT", counter + 1);
    });

    socket.on("decrement", counter => {
        console.log("decrement");
        io.sockets.emit("COUNTER_DECREMENT", counter - 1);
    });
});
// for (let index = 0; index <= meses.length; index++) {
//     var pesquisar = meses[index]+ " de "+data.getFullYear();
//     var mes = meses[index];
//     if(index == 11){
//       res.status(200).json({erro:false, Janeiro:result, Fevereiro:fevereiro, 
//         Marco:marco, Abril:abril, Maio:maio, Junho:junho, Julho:julho,
//          Agosto:agosto, Setembro:setembro, Outubro:outubro, Novembro:novembro, Dezembro:dezembro})
//     }
//     global.db.quantidadeOSMeses(pesquisar[index],(erro,mes)=>{
//       if(erro){
//         res.send(400).json(erro)
//       }
// })
// }
module.exports = router;
