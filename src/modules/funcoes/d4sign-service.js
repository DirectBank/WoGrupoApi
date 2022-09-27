/* Link para a Api do D4sign
https://docapi.d4sign.com.br/docs/introdu%C3%A7%C3%A3o-a-api */


// let tokenParams = {
//     tokenAPI: 'live_064310ad9ddf153133010fd139364a2bd523e027dc84e7de7bca3bc4c9bc6110',
//     cryptKey: 'live_crypt_Rl5cTiAxlML5cUXUe6OZpE1HULr4w5iT'
// }

let axios = require('axios').create({
    // baseURL: 'https://sandbox.d4sign.com.br/api/v1', //DESENV
    baseURL: 'https://secure.d4sign.com.br/api/v1', //PROD
    timeout: 1000 * 60, // 1 minuto
    headers: { 'Content-Type': 'application/json' }
});



// Lista os cofres cadastrados de uma empresa 
const listaCofresEmpresa = (tokenParams) => new Promise(async (resolve, reject) => {

    try {

        let result = await axios({
            method: "get",
            url: `/safes`,
            params: { ...tokenParams }
        });

        // console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);

    }

});

//#region Documentos 
const listaDocumentosCofre = (uuid_cofre, tokenParams) => new Promise(async (resolve, reject) => {

    try {

        let result = await axios({
            method: "get",
            url: `/documents/${uuid_cofre}/safe`,
            params: { ...tokenParams }
        });

        console.log(result);
        resolve(result.data ? result.data : [])

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);

    }
});

const downloadDocumento = (uuid_documento, tokenParams) => new Promise(async (resolve, reject) => {

    let body = {
        type: "PDF",
        language: "pt"
    }

    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/download`,
            data: body,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);


    }



});

const uploadDocumentoCofre = (documento, uuid_cofre, tokenParams) => new Promise(async (resolve, reject) => {

    let base64_binary_file = Buffer.from(documento.buffer).toString('base64')
    let body = {
        base64_binary_file,
        mime_type: documento.mimetype,
        name: documento.originalname
    }

    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_cofre}/uploadbinary`,
            data: body,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);

    }



});

const cancelarDocumentoCofre = (uuid_documento, comentario = '', tokenParams) => new Promise(async (resolve, reject) => {

    let body = {
        comment: comentario
    }

    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/cancel`,
            data: body,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log(error.response)
            errorResult = { message: error.response.data.mensagem_pt }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.message }
        }

        reject(errorResult);

    }



});

const enviaDocumentoParaAssinatura = (uuid_documento, comentario = '', tokenParams) => new Promise(async (resolve, reject) => {

    let body = {
        "message": comentario,
        "skip_email": "0", //0= Os signatários serão avisados por e-mail que precisam assinar um documento. / 	1 = O e-mail não será disparado.
        "workflow": "0",
    }

    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/sendtosigner`,
            data: body,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);

    }



});

const reenviaDocumentoParaAssinatura = (uuid_documento, email, key_signer = '', tokenParams) => new Promise(async (resolve, reject) => {

    let body = {
        "email": email,
        //"key_signer": key_signer, //Chave de assinatura Gerada no momento do cadastro de signatario
    }

    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/resend`,
            data: body,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }

        reject(errorResult);

    }



});

//#endregion


//#region CRUD Signatarios
const listaSignatariosDocumento = (uuid_documento, tokenParams) => new Promise(async (resolve, reject) => {

    try {

        let result = await axios({
            method: "get",
            url: `/documents/${uuid_documento}/list`,
            params: { ...tokenParams }
        });

        console.log(result);
        resolve(result.data ? result.data : [])

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log(error.response)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.message }
        }

        reject(errorResult);

    }
});

const listaAcoesSignatarios = () => new Promise((resolve, reject) => {
    resolve([
        {
            id_acao: 1,
            descricao: 'Assinar',
        },
        {
            id_acao: 2,
            descricao: 'Aprovar',
        },
        {
            id_acao: 3,
            descricao: 'Reconhecer',
        },
        {
            id_acao: 4,
            descricao: 'Assinar como parte',
        },
        {
            id_acao: 5,
            descricao: 'Assinar como testemunha',
        },
        {
            id_acao: 6,
            descricao: 'Assinar como interveniente',
        },
        {
            id_acao: 7,
            descricao: 'Acusar recebimento',
        },
        {
            id_acao: 8,
            descricao: 'Assinar como Emissor, Endossante e Avalista',
        },
        {
            id_acao: 9,
            descricao: 'Assinar como Emissor, Endossante, Avalista, Fiador',
        },
        {
            id_acao: 10,
            descricao: 'Assinar como fiador',
        },
        {
            id_acao: 11,
            descricao: 'Assinar como parte e fiador',
        },
        {
            id_acao: 12,
            descricao: 'Assinar como responsável solidário',
        },
        {
            id_acao: 13,
            descricao: 'Assinar como parte e responsável solidário',
        }
    ])
});

const cadastrarSignatarioDocumento = (signatarios, uuid_documento, tokenParams) => new Promise(async (resolve, reject) => {


    try {

        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/createlist`,
            data: signatarios,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);
    }



});

const deletarSignatarioDocumento = (signatarioParaDelecao, uuid_documento, tokenParams) => new Promise(async (resolve, reject) => {


    try {


        let result = await axios({
            method: "post",
            url: `/documents/${uuid_documento}/createlist`,
            data: signatarioParaDelecao,
            params: { ...tokenParams }
        });

        console.log(result.data);
        resolve(result.data)

    } catch (error) {
        let errorResult = {};
        if (error.response) {
            // A requisição foi feita e o servidor respondeu com um código de status
            // que sai do alcance de 2xx
            console.log('Error response', error.response.data)
            errorResult = { statusCode: error.response.status, message: error.response.data.message }
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
        }
        else {

            // Alguma coisa acontenceu ao configurar a requisição que acionou este erro.
            console.error('Error', error);
            errorResult = { statusCode: 400, menssage: error.data.message }
        }
        reject(errorResult);

    }



});


//#endregion




// listaCofresEmpresa().then((result) => {
//     console.log('Result,', result);
// }).catch((error) => {
//     console.error(error)
// });

// uploadDocumentoCofre('Teste contexto documento', 'teste').then((result) => {
//     console.log('Result,', result);
// }).catch((error) => {
//     console.error(error)
// });


// uploadDocumentoCofre('Teste contexto documento', '65ed298c-e16f-4f28-aa74-7bbd28827a46').then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error)
// });

module.exports = {
    listaCofresEmpresa,
    listaDocumentosCofre,
    listaAcoesSignatarios,
    uploadDocumentoCofre,
    cancelarDocumentoCofre,
    cadastrarSignatarioDocumento,
    deletarSignatarioDocumento,
    listaSignatariosDocumento,
    enviaDocumentoParaAssinatura,
    reenviaDocumentoParaAssinatura,
    downloadDocumento
}