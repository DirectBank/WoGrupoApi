const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
TYPES = require('tedious').TYPES;
const drive = require('../drive/drive');

function buildEvolucao2(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': query.id_empreendimento
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 0
        }

    ];
}

routes.get('/', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        query.id_empresa = query.id_empresa ? query.id_empresa : 2016;
        let respostaBanco;

        console.log(query.id_empresa, (query.id_empresa != 2016 && query.id_empresa != 10))

        if (query.id_empresa && (query.id_empresa != 2016 && query.id_empresa != 10))
            throw ({ statusCode: 400, message: "Parâmetros inválidos." })

        respostaBanco = await consultaBanco('APPSP_evolucaoEtapa', produto, buildEvolucao2(query));

        respostaBanco.rows = respostaBanco.rows.map(el => {
            return {
                empreendimentoNome: el.empreendimentoNome,
                etapaDescricao: el.etapaDescricao,
                etapaEvolucao: el.etapaEvolucao,
                etapaOrdem: el.etapaOrdem,
            }
        })

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