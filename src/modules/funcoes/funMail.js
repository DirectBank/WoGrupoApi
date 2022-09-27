const sgMail = require('@sendgrid/mail');
var path = require('path');
let ejs = require('ejs');

function enviarEmailSendGrid() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let html
    const pathEjs = path.resolve('src/modules/assets/templates/comunicado-assembleia.ejs');
    const data = {
        nome: "Marcelo Thomaz",
        edificio: "1001 - WAY ORQUIDARIO",
        descricaoAssembleia: "Assembleia ordinária",
        dataInicio: "26/08/2020",
        hora1: "17:00",
        hora2: "17:30",
        linkReuniao: "https://www.omeupredio.com.br/index.html"

    }

    return new Promise((resolve, reject) => {
        ejs.renderFile(pathEjs, data, function (err, str) {
            // str => Rendered HTML string
            if (err) {
                reject(err);
                return
            }
            else {
                html = str;
            }
        });
        const msg = {
            "personalizations": [
                {
                    to: [{ "email": "brsouza.ti@hotmail.com" }],
                }
            ],
            // reply_to: { "email": "brsouza.ti@hotmail.com" },
            from: { "email": "comunicacao@meupredio.com.br" },
            subject: 'Email Teste Unidadez',
            text: 'and easy to do anywhere, even with Node.js',
            html: html,
        };
        sgMail
            .send(msg)
            .then((data) => { resolve(data) }, error => {
                if (error.response) {
                    reject(error.response.body)
                }
            });
    })


}

function enviaPushNotification() {

}

module.exports = { enviarEmailSendGrid }