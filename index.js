// Monitoramento da API via APM ELK
const { env } = require('process');
// var apm = require('elastic-apm-node').start({
//     serviceName: 'WoGrupoApi',
//     secretToken: 'iAX9cbq8BlB1jYn84B',
//     serverUrl: 'https://d28f68aee7874851b01293f63b065dd9.apm.westus2.azure.elastic-cloud.com:443',
//     environment: env.NODE_ENV,
//     captureBody: 'all'
// });

const app = require('express')();
const https = require('https');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./src/config/routes');
const methodOverride = require('method-override');
var fs = require('fs');
const cors = require('cors');

const port = process.env.PORT;

const originalSend = app.response.send;
app.response.send = function sendOverride(body) {
    this.responseBody = body;
    return originalSend.call(this, body);
};

app.use(helmet());
app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(methodOverride());
app.use(cors());
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:8100', 'http://localhost:62542','http://localhost:51996', 'https://www.omeupredio.com.br', 'https://sendgrid.api-docs.io'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Authorization");
    next();
});

// app.use((req, res, next) => {
//     res.on('finish', () => {
//         if (apm.currentTransaction) {
//             apm.currentTransaction.addLabels({ resposeBody: res.responseBody });
//         }
//         // console.log(apm.currentTransaction.ids)

//     });
//     next();
// });


app.use('/wo', routes);


// app.get('/omp/ws', (res, req) => {

// });

if (process.env.HTTPS_LOCAL == "1") {

    var httpOptions = {
        key: fs.readFileSync("privatekey.key"),
        cert: fs.readFileSync("certificate.crt")
    }

    const server = https.createServer(httpOptions, app);
    // const io = require('socket.io')(server, {
    //     transport: ['websocket'],
    //     path: '/omp/ws',
    //     origins: '*:*'
    // });
    server.listen(port, () => { console.log(`HTTPS - Listening to port ${port}`) });
    // socketWSAssembleia.socket(io);

}
else {

    //Rodando a api na port -> Port
    const server = require('http').createServer(app);
    // const io = require('socket.io')(server, {
    //     path: '/v3/socket.io',
    //     origins: ['*:*']
    // });

    server.listen(port, () => { console.log(`Listening to port ${port}`) });
    // socketWSAssembleia.socket(io)

}