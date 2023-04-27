const Connection = require('tedious').Connection;
const TYPES = require('tedious').TYPES;
const Request = require('tedious').Request;
var pktJson = require('./../../../package.json');
const OFICIAL = process.env.OFICIAL; //VARIAVEL PARA TROCAR A BASE DE DADOS
// var apm = require('elastic-apm-node')

const configConexao = (produto, oficial) => {

    if (produto === "construtora") produto = "wo";

    const connections = JSON.parse(process.env.DB);

    return {
        authentication: {
            options: {
                userName: connections[produto].DB_USER,
                password: connections[produto].DB_PASSWORD,
                appName: pktJson.name
            },
            type: 'default'
        },
        server: connections[produto].SERVER,
        options: {
            database: connections[produto].DB_SCHEMA,
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: true,
            port: Number(connections[produto].DB_PORT)
        }
    }
}


const buildRequest = (procName, [...params], resolve, reject, connection) => {

    try {

        var responseTable = [];
        var request = new Request(procName, (error) => {
            if (error) {
                console.log("Request", error);
                reject(request.error);
                return;
            }
        });

        let query = procName + ' '

        for (param of params) {

            if (param['output'] && (typeof param['output']) === (typeof Boolean())) {

                if (param['valor'] != undefined) {
                    // console.log(`Adicionou output param ${param['nome']} com valor ${param['valor']} tipo ${param['tipo']}` )
                    request.addOutputParameter(param['nome'], param['tipo'], param['valor']);
                } else {
                    // console.log(`Adicionou output param ${param['nome']} sem valor` )
                    request.addOutputParameter(param['nome'], param['tipo']);
                }
            } else {
                // console.log(`Adicionou param ${param['nome']} sem valor`);

                if (param['valor'] == undefined) {
                    if ((param['required']) || (typeof param['required']) !== (typeof Boolean()))
                        throw ({ statusCode: 400, type: "ParametersError", message: `Ausência de parâmetros, ou parâmetros não esperados.${process.env.NODE_ENV == 'development' ? 'Nome do campo: ' + param['nome'] : ''}` });
                } else {
                    request.addParameter(param['nome'], param['tipo'], param['valor']);
                }
            }

            // Adiciona os campos ao APM ELK
            // if (apm.currentTransaction) {

            //     if (param['nome'] == "id_empresa") {
            //         apm.currentTransaction.addLabels({ id_empresa: param['valor'] });
            //     } else if (param['nome'] == "id_cliente") {
            //         apm.currentTransaction.addLabels({ id_cliente: param['valor'] });
            //     } else if (param['nome'] == "id_usuario") {
            //         apm.currentTransaction.addLabels({ id_usuario: param['valor'] });
            //     }
            // }
            // query += params.indexOf(param) < params.length - 1 ? `@${param['nome']}='${param['valor']}', ` : `@${param['nome']}='${param['valor']}'`


        }
        // Adiciona a Label no ELK
        // if (apm.currentTransaction) {
        //     // console.log(apm.currentTransaction.addLabels)
        //     apm.currentTransaction.addLabels({ sqlCommand: query })
        // }

        request.on('returnValue', async (parameterName, value, metadata) => {
            this.outputParameter = (outputParameter == undefined ? {} : outputParameter);
            this.outputParameter[parameterName] = (value === null ? undefined : value);
        });

        request.on('row', (columns) => {

            try {
                let rows = {};
                responseTable = (responseTable == undefined ? [] : responseTable);

                columns.forEach(function (column) {

                    // if (column.value === null) {
                    //     // console.log('NULL');
                    //     row[column.metadata.colName] = undefined;
                    // } else {
                    //     //console.log("Output: " + column.value);  
                    //     row[column.metadata.colName] = column.value;
                    // }
                    rows[column.metadata.colName] = column.value;

                });
                responseTable.push(rows);


            } catch (rowEventError) {
                request.error = errorHandler(rowEventError);
            }
        });

        request.on('requestCompleted', async (rows) => {

            if (request.error) {
                reject(errorHandler(request.error));
            } else {
                try {
                    let sqlResponse = {};

                    if (responseTable.length > 1) {
                        sqlResponse.rows = responseTable;
                    } else {
                        sqlResponse.rows = (responseTable[0] == undefined ? [] : responseTable);
                    }
                    sqlResponse.outputParameter = (this.outputParameter == undefined ? {} : this.outputParameter);
                    resolve(sqlResponse);
                } catch (sqlError) {
                    reject(errorHandler(sqlError));
                }
                finally {
                    connection.close();
                }

            }
        });

        return request;

    } catch (sqlError) {
        reject(sqlError);
    }
}

const consultarBanco = async (procName, produto, [...params]) => {
    let connection
    return await new Promise(async (resolve, reject) => {
        try {
            connection = new Connection(configConexao(produto, OFICIAL));

            connection.on('connect', async (err) => {
                if (err) {
                    return reject(err);
                }
                else {
                    let request = buildRequest(procName, [...params], resolve, reject, connection);
                    await connection.callProcedure(request);

                }
            });
            // connection.connect();

        } catch (sqlError) {
            console.log("Error Catch Promise", sqlError);
            connection.close();
            reject(sqlError);
        }

    });

}

let errorHandler = (error) => {

    switch (typeof error) {
        case typeof TypeError:
            return { statusCode: 500, message: error.message, typeError: typeof error }
            break;

        default: return { statusCode: 500, message: error.message, errorObject: typeof error };
    }
}

module.exports = consultarBanco;