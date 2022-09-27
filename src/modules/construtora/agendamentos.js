const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
const xml2js = require("xml2js");
const { TYPES } = require('tedious');
var parseString = new xml2js.Parser({ explicitArray: false }).parseString;

function buildConstrutoraQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_cliente',
            'tipo': TYPES.Int,
            'valor': query.id_cliente
        },
        {
            'nome': 'mesAno',
            'tipo': TYPES.VarChar,
            'valor': query.mesAno
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 20
        }

    ];
}

routes.get('/agendamentos', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_agendamento', produto, buildConstrutoraQueryParams(query));

        respostaBanco.rows.forEach(element => {
            parseString(element.agenda, function (err, results) {

                let data = results.table.row.filter((el) => el.id_tabela > 0);
                element.agenda = data.map((el) => {
                    let newEl = {
                        title: el.descricao,
                        status: el.confirmada,
                        id_agenda: el.id_tabela,
                        tipo: el.tipo,
                        startTime: new Date(
                            element.data.toISOString().split("T")[0] + "T" + el.hora + ":00-03:00"
                        ),
                        endTime: new Date(
                            element.data.toISOString().split("T")[0] + "T" + el.horaFim + ":00-03:00"
                        ),

                    }
                    return newEl

                })
            });
        });

        respostaBanco.rows = respostaBanco.rows.filter((el) => el.agenda.length > 0).map(el => el.agenda).flat();

        res.status(200).json(respostaBanco.rows);

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraTiposQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 10
        }

    ];
}

routes.get('/tipos-agendamento', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_agendamento', produto, buildConstrutoraTiposQueryParams(query));

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraBody(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_cliente',
            'tipo': TYPES.Int,
            'valor': body.id_cliente
        },
        {
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': body.id_empreendimento
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': body.id_contrato
        },
        {
            'nome': 'id_tipoVisita',
            'tipo': TYPES.Int,
            'valor': body.id_tipoVisita
        },
        {
            'nome': 'motivo',
            'tipo': TYPES.NVarChar,
            'valor': body.motivo
        },
        {
            'nome': 'dataAgendamento',
            'tipo': TYPES.VarChar,
            'valor': body.dataAgendamento
        },
        {
            'nome': 'horaAgendamento',
            'tipo': TYPES.VarChar,
            'valor': body.horaAgendamento
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 1
        }

    ];
}

routes.post('/', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_agendamento', produto, buildConstrutoraBody(body));

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraCancelaBody(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_cliente',
            'tipo': TYPES.Int,
            'valor': body.id_cliente
        },
        {
            'nome': 'id_visita',
            'tipo': TYPES.Int,
            'valor': body.id_visita
        },
        {
            'nome': 'cancelada',
            'tipo': TYPES.Int,
            'valor': 1
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 22
        }

    ];
}

routes.put('/cancelar', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_agendamento', produto, buildConstrutoraCancelaBody(body));

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

module.exports = routes