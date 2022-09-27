const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const { query } = require('express');

routes.post("/refresh-token", async (req, res, next) => {

    debugger;
    const { body } = req;
    const { baseUrl } = req;

    try {

        if (req.authType == 'JWT') {
            console.log("Credentials match");
            jwt.sign({
                id_usuario: req.id_empresa,
                id_empresa: req.id_cliente,
                id_cliente: req.id_usuario,
                tipo: req.tipo
            },
                '$!!@$P18%&(5*(8$%sdRsd0f@$!#23zxc50qGe7+?YU6OK4==', {
                expiresIn: '1h'
            },
                (err, token) => {
                    if (err) {
                        console.log(err)
                        res.status(401).send({ message: "Erro ao gerar o token!!" })
                    } else {
                        let date = Date.now(); // Data corrente em milisegundos 
                        res.status(200).json({ token, expiresIn: date + 3600000 });
                    }
                });
        } else {
            res.status(401).send({ message: "Token invalido!!" })
        }

    } catch (resposeError) {
        console.log(resposeError);
        res.status(500).json(resposeError);
    }

});

module.exports = routes;