const jwtService = require('../modules/segurancaApi/jwtService');
const authRoutes = require('../modules/segurancaApi/auth-routes');
const apiKeyService = require('../modules/segurancaApi/apiKeyService');
const funUtilRoutes = require('../modules/funcoes/funUtilRoutes')
const routes = require('express').Router();

// Import dos módulos do sistema

const authConstrutora = require('../modules/construtora/autenticacao/auth');
const menuContrutora = require('../modules/construtora/menu/menu');
const cobrancaContrutora = require('../modules/construtora/cobranca/boletos');
const planosPagamentoContrutora = require('../modules/construtora/planos-pagamento');
const empreendimentoContrutora = require('../modules/construtora/empreendimento');
const comunicadosContrutora = require('../modules/construtora/comunicados');
const documentosContrutora = require('../modules/construtora/documentos');
const emailComunicadosConstrutora = require('../modules/construtora/email/envia-comunicado');
const pushComunicadosConstrutora = require('../modules/construtora/push-notification/envia-push');
const alteraSenhaContrutora = require('../modules/construtora/altera-senha');
const agendamentosContrutora = require('../modules/construtora/agendamentos');
const faleConoscoContrutora = require('../modules/construtora/fale-conosco');
const lgpdContrutora = require('../modules/construtora/termoLgpd');
const personalizacoesContrutora = require('../modules/construtora/personalizacoes');
const vistoriasContrutora = require('../modules/construtora/vistoria');
const evolucaoEmpreendimento = require('../modules/construtora/empreendimento-no-auth')

const assinaturaEletronica = require('../modules/assinatura-eletronica/d4sign-routes')

routes.use('/construtora/auth', authConstrutora);

routes.use('/evolucao-empreendimento', evolucaoEmpreendimento);


//Declaração dos Middlewares de Autenticação
if (process.env.ATIVA_AUTH == '1') {

    routes.use((req, res, next) => {
        if (process.env.ATIVA_JWT == '1' && req.headers['authorization']) {
            req.authType = 'JWT';
            jwtService.jwtHandler(req, res, next);

        } else if (process.env.ATIVA_APIKEY == '1' && req.headers['x-api-key']) {
            req.authType = 'APIKEY';
            apiKeyService.apiKeyHandler(req, res, next);
        } else {
            res.status(403).send({
                message: 'No token provided.'
            });
        }

    });
}

//Rotas para gerenciamento da Seguranca
routes.use('/auth', authRoutes);



// Rotas para o modulo funções por requisições
routes.use('/util', funUtilRoutes);

//Rotas para o modulo Construtora
routes.use('/construtora/menu', menuContrutora);

//Rotas Construtora
routes.use('/construtora/cobranca/boletos', cobrancaContrutora);
routes.use('/construtora/planos-pagamento', planosPagamentoContrutora);
routes.use('/construtora/empreendimento', empreendimentoContrutora);
routes.use('/construtora/comunicados', comunicadosContrutora);
routes.use('/construtora/documentos', documentosContrutora);
routes.use('/construtora/email/comunicados', emailComunicadosConstrutora);
routes.use('/construtora/push/comunicados', pushComunicadosConstrutora);
routes.use('/construtora/altera-senha', alteraSenhaContrutora);
routes.use('/construtora/agendamentos', agendamentosContrutora);
routes.use('/construtora/fale-conosco', faleConoscoContrutora);
routes.use('/construtora/lgpd', lgpdContrutora);
routes.use('/construtora/personalizacoes', personalizacoesContrutora);
routes.use('/construtora/vistorias', vistoriasContrutora);

//Rotas para assinatura eletônica
routes.use('/assinatura-eletronica', assinaturaEletronica);


module.exports = routes;