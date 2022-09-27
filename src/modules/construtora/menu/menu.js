const routes = require('express').Router();
const consultaBanco = require('../../funcoes/funDB');
TYPES = require('tedious').TYPES;

function buildConstrutoraQueryParams(query) {

    return [{
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 0
        }
    ]

}

routes.get("/", async(req, res, next) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa })
        }

        respostaBanco = await consultaBanco('APPSP_menu', produto, buildConstrutoraQueryParams(query));

        res.status(200).json(respostaBanco.rows)

    } catch (responseError) {
        console.log(responseError);
        if (responseError.statusCode == undefined) {
            res.status(500).json(responseError);
        } else {
            res.status(responseError.statusCode).json(responseError);
        }
    }

});



module.exports = routes