const jwt = require('jsonwebtoken');

function jwtHandler(req, res, next) {

    let authHeader = req.headers['authorization'];
    const { baseUrl, path } = req;
    const produto = baseUrl.split('/')[1];
    const modulo = path.split('/')[1];

    if (authHeader) {
        const bearer = authHeader.split(' ');
        const token = bearer[1];

        jwt.verify(token, '$!!@$P18%&(5*(8$%sdRsd0f@$!#23zxc50qGe7+?YU6OK4==', (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Sessão expirada' });
            }
            else {
                if (produto == 'wo' && modulo == 'construtora') {
                    req.bodyToken = decoded;
                }
                else if (produto == 'construtora' && modulo == 'construtora') {
                    req.bodyToken = decoded;
                }
                else {
                    req.id_usuario = decoded['id_usuario'];
                    req.id_empresa = decoded['id_empresa'];
                    req.id_cliente = decoded['id_cliente'];
                    req.tipo = decoded['tipo'];
                    req.readOnly = decoded['readOnly'];
                    req.produto = decoded['produto'];
                }

                if (decoded['readOnly'] == true && req.method != "GET") {
                    return res.status(401).json({ message: 'Operação não permitida' });
                }
                else if ((decoded['readOnly'] == true) && (produto != 'chatbot' && (decoded['produto'] != produto))) {
                    return res.status(401).json({ message: 'Operação não permitida' });
                }
                else {
                    next();
                }
            }
        });
    }
    else {
        res.status(403).send({
            message: "No token provided."
        });
    }
}

module.exports = { jwtHandler }