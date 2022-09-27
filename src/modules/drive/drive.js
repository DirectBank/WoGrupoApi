const { Storage } = require('@google-cloud/storage');
const { query } = require('express');
const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
TYPES = require('tedious').TYPES;
const multer = require('multer');
const { permittedCrossDomainPolicies } = require('helmet');

const storage = new Storage({
    keyFilename: process.env.FIREBASE_STORAGE
        //keyFilename: "src/modules/drive/workoffice-drive-firebase-adminsdk.json" //desenv
});

const bucket = storage.bucket("gs://workoffice-drive.appspot.com");
const bucketFilesToDownload = storage.bucket("gs://arquivos_para_baixar");
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});

const uploadFile = (file, file_name, file_path, id_empresa, id_cliente, produto) => new Promise((resolve, reject) => {

    const { originalname, buffer } = file;

    let blob;

    if (produto === "wo") {
        blob = bucket.file(`${produto.toUpperCase()}/${id_empresa}/${file_path.length > 0 ? file_path.toUpperCase() : ''}/${file_name.replace(/ /g, "_")}`);
    } else {
        blob = bucket.file(`${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.length > 0 ? file_path.toUpperCase() : ''}/${file_name.replace(/ /g, "_")}`);
    }

    blob.exists((err, exists) => {

        if (!exists) {
            const blobStream = blob.createWriteStream({
                resumable: false
            });

            blobStream.on('finish', (res) => {
                    resolve(`${blob.name}`)
                })
                .on('error', () => {
                    reject(`Algo deu errado e sua operação não foi concluída.`)
                })
                .end(buffer)
        } else {
            reject(`Um arquivo com este mesmo nome já existe, altere o nome e tente novamente.`)
        }
        if (err) {
            reject(err)
        }
    })
})

const uploadFileByPath = (file, file_name, file_path, id_empresa, produto) => new Promise((resolve, reject) => {

    const { originalname, buffer } = file;

    let blob;

    blob = bucket.file(`${produto.toUpperCase()}/${id_empresa}/${file_path.length > 0 ? file_path.toUpperCase() : ''}/${file_name.replace(/ /g, "_")}`);

    blob.exists((err, exists) => {

        if (!exists) {
            const blobStream = blob.createWriteStream({
                resumable: false
            });

            blobStream.on('finish', (res) => {
                    resolve(`${blob.name}`)
                })
                .on('error', () => {
                    reject(`Algo deu errado e sua operação não foi concluída.`)
                })
                .end(buffer)
        } else {
            reject(`Um arquivo com este mesmo nome já existe, altere o nome e tente novamente.`)
        }
        if (err) {
            reject(err)
        }
    })
})

const deleteFile = (file_url) => new Promise((resolve, reject) => {
    if (
        file_url &&
        file_url.length > 1

    ) {
        try {
            let blob = bucket.file(file_url)
            blob.exists(async(err, exists) => {
                if (exists) {
                    await bucket.deleteFiles({ prefix: `${file_url}` });
                    resolve('sucess')
                } else {
                    console.log(err)
                    reject(err)
                }
            })
        } catch (e) {
            reject(e)
        }
    } else {
        reject(`Parâmetros ausentes ou arquivo não encontrado.`)
    }
});

const getLinkUrl = (file_url) => new Promise(async(resolve, reject) => {
    if (file_url) {
        try {
            bucketName = file_url;
            const blob = await bucket.file(bucketName);
            await blob.exists(async(err, exists) => {
                if (exists) {
                    resolve({
                        url: await bucket.file(bucketName).getSignedUrl({
                            version: 'v2',
                            action: 'read',
                            expires: Date.now() + 1000 * 60 * 60,
                        }),
                        expiresIn: new Date(Date.now() + 1000 * 60 * 60).toLocaleString()
                    })
                } else {
                    console.log(err)
                    reject(e)
                }
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    } else {
        resolve({ url: null })
    }
});

//Região para bucketFilesToDownload
const uploadFileBucketFilesToDownload = (buffer, file_name, file_path, id_empresa, id_cliente, produto) => new Promise((resolve, reject) => {

    let blob;

    if (produto === "wo") {
        blob = bucketFilesToDownload.file(`${produto.toUpperCase()}/${id_empresa}/${file_path.length > 0 ? file_path.toUpperCase() : ''}/${file_name.replace(/ /g, "_")}`);
    } else {
        blob = bucketFilesToDownload.file(`${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.length > 0 ? file_path.toUpperCase() : ''}/${file_name.replace(/ /g, "_")}`);
    }

    blob.exists((err, exists) => {

        if (!exists) {
            const blobStream = blob.createWriteStream({
                resumable: false
            });

            blobStream.on('finish', (res) => {
                    resolve(`${blob.name}`)
                })
                .on('error', (err) => {
                    console.log(err)
                    reject(`Algo deu errado e sua operação não foi concluída.`)
                })
                .end(buffer)
        } else {
            reject(`Um arquivo com este mesmo nome já existe, altere o nome e tente novamente.`)
        }
        if (err) {
            console.log(err)
            reject(err)
        }
    })
});

const getLinkUrlFilesToDownload = (file_url) => new Promise(async(resolve, reject) => {

    if (file_url) {
        try {
            bucketName = file_url;
            const blob = await bucketFilesToDownload.file(bucketName);
            await blob.exists(async(err, exists) => {
                if (exists) {
                    resolve({
                        arquivo: await bucketFilesToDownload.file(bucketName).get({
                                autoCreate: true
                            })
                            // })
                            // expires: Date.now() + 1000 * 60 * 60,
                            // }),
                            // expiresIn: new Date(Date.now() + 1000 * 60 * 60).toLocaleString()
                    })
                } else {
                    console.log(err)
                    reject('Arquivo não encontrado')
                }
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    } else {
        resolve({ url: null })
    }
});

const deleteFileToDownload = (file_url) => new Promise((resolve, reject) => {
    if (
        file_url &&
        file_url.length > 1

    ) {
        try {
            let blob = bucketFilesToDownload.file(file_url)
            blob.exists(async(err, exists) => {
                if (exists) {
                    await bucketFilesToDownload.deleteFiles({ prefix: `${file_url}` });
                    resolve('sucess')
                } else {
                    console.log(err)
                    reject(err)
                }
            })
        } catch (e) {
            reject(e)
        }
    } else {
        reject(`Parâmetros ausentes ou arquivo não encontrado.`)
    }
});

routes.post('/upload', multerMid.single('file'), (req, res) => {
    let { file } = req;
    let { id_empresa, id_cliente, file_path, file_name } = req.query;
    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];
    console.log(file, id_empresa, id_cliente);
    if ((file && id_empresa) && (id_cliente || produto === "wo")) {
        uploadFile(file, file_name, file_path ? file_path.toUpperCase() : '', id_empresa, id_cliente, produto).then((success) => {
            res.status(200).send({
                status: 'success',
                url: success
            });
        }).catch((error) => {
            console.error(error);
            res.status(400).send({
                status: 'failure',
                message: error
            });
        });
    } else {
        res.status(400).send({
            status: 'failure'
        });
    }
});

routes.post('/upload-url', multerMid.single('file'), (req, res) => {
    let { file } = req;
    let { id_empresa, id_cliente, file_path, file_name } = req.query;
    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if ((file && id_empresa)) {
        uploadFileByPath(file, file_name, file_path ? file_path.toUpperCase() : '', id_empresa, produto).then((success) => {
            res.status(200).send({
                status: 'success',
                url: success
            });
        }).catch((error) => {
            console.error(error);
            res.status(400).send({
                status: 'failure',
                message: error
            });
        });
    } else {
        res.status(400).send({
            status: 'failure'
        });
    }
});

routes.get('/link', async(req, res) => {

    let { id_empresa, id_cliente, file_path, file_name } = req.query
    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if ((id_empresa && file_name) && (id_cliente || produto === "wo")) {
        try {
            bucketName = `${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.toUpperCase()}/${file_name}`;
            const blob = bucket.file(bucketName);
            blob.exists(async(err, exists) => {
                if (exists) {
                    res.status(200).json({
                        url: await bucket.file(bucketName).getSignedUrl({
                            version: 'v2',
                            action: 'read',
                            expires: Date.now() + 1000 * 60 * 60,
                        }),
                        expiresIn: new Date(Date.now() + 1000 * 60 * 60).toLocaleString()
                    })
                } else {
                    res.status(404).json({
                        message: "Parâmetros ausentes ou arquivo não encontrado."
                    });
                }
            })
        } catch (e) {
            console.log(e)
            res.status(500).send();
        }
    } else {
        res.status(404).json({
            message: "Parâmetros ausentes ou arquivo não encontrado."
        });
    }

})

routes.get('/download', async(req, res) => {

    let { id_empresa, id_cliente, file_path, file_name } = req.query
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    if ((id_empresa && file_name) && (id_cliente || produto === "wo")) {
        try {
            bucketName = `${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.toUpperCase()}/${file_name}`;
            const blob = bucket.file(bucketName);
            blob.exists(async(err, exists) => {
                if (exists) {
                    res.redirect(await bucket.file(bucketName).getSignedUrl({
                        version: 'v2',
                        action: 'read',
                        expires: Date.now() + 1000 * 60 * 10, // ten minutes
                    }))
                } else {
                    res.status(404).json({
                        message: "Parâmetros ausentes ou arquivo não encontrado."
                    });
                }
            })
        } catch (e) {
            res.status(500).json(e);
        }
    } else {
        res.status(404).json({
            message: "Parâmetros ausentes ou arquivo não encontrado."
        });
    }

})

routes.get('/download-url', async(req, res) => {
    let { file_url } = req.query
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {
        bucketName = `${file_url}`;
        const blob = bucket.file(bucketName);
        blob.exists(async(err, exists) => {
            if (err) { console.log(err) }
            if (exists) {
                res.redirect(await bucket.file(bucketName).getSignedUrl({
                    version: 'v2',
                    action: 'read',
                    expires: Date.now() + 1000 * 60 * 10, // ten minutes
                }))
            } else {
                res.status(404).json({
                    message: "Parâmetros ausentes ou arquivo não encontrado."
                });
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json(e);
    }
})

function buildOmpQueryParams(query) {

    return [{
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'limiteEspaco',
            'tipo': TYPES.Float,
            'valor': query.limiteEspaco
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 4
        }
    ]
}

routes.get('/size', async(req, res) => {


    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {
        if (query.id_empresa) {
            let filesArray = (await bucket.getFiles({ prefix: `${produto.toUpperCase()}/${query.id_empresa}` }))[0] //.filter(file => file.metadata.id.includes(`${id_empresa}/${id_cliente}`))
            let arraySize = filesArray.reduce((acc, curr) => {
                return acc += parseInt(curr.metadata.size)
            }, 0);

            arraySize = (arraySize / (Math.pow(1024, 3))); //converte para GB
            Object.assign(query, { limiteEspaco: arraySize });


            if (produto == 'direct') {
                respostaBanco = await consultaBanco('SCCSP_planoGED', produto, buildOmpQueryParams(query));
            } else if (produto == 'unidadez') {
                respostaBanco = await consultaBanco('SCCSP_planoGED', produto, buildOmpQueryParams(query));
            } else {
                throw ({ statusCode: 400, type: "UrlRequestError", message: `Produto inválido.${process.env.NODE_ENV == 'development' ? 'Verifique a rota de chamada a API' : ''}` });
            }

            res.status(200).json(respostaBanco.rows[0])
        } else {
            res.status(404).json({
                message: "Parâmetros ausentes."
            });
        }

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }


})

routes.get('/', async(req, res) => {

    let { id_empresa, id_cliente, file_path, file_name } = req.query
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];


    if ((id_empresa && file_name) && (id_cliente || produto === "wo")) {
        try {
            bucketName = `${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.toUpperCase()}/${file_name}`;
            const blob = bucket.file(bucketName);
            blob.exists(async(err, exists) => {
                if (exists) {
                    res.status(200).json(
                        await bucket.file(bucketName).getMetadata(),
                    )
                } else {
                    res.status(404).json({
                        message: "Parâmetros ausentes ou arquivo não encontrado."
                    });
                }
            })

        } catch (e) {
            res.status(500).send();
        }
    } else {
        res.status(404).json({
            message: "Parâmetros ausentes ou arquivo não encontrado."
        });
    }

})

routes.delete('/url', async(req, res) => {

    let { file_url } = req.query

    if (
        file_url &&
        file_url.length > 1
    ) {
        try {

            if (await bucket.deleteFiles({
                    prefix: `${file_url}`
                })) {
                res.status(200).json({
                    message: "Arquivos sob a url fornecida permanentemente excluídos com sucesso.",
                    status: "success"
                })
            }

        } catch (e) {
            res.status(500).send(e);
        }
    } else {
        res.status(404).json({
            message: "Parâmetros ausentes ou arquivo não encontrado."
        });
    }

})

routes.delete('/', async(req, res) => {

    let { id_empresa, id_cliente, file_path, file_name } = req.query
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    if ((id_empresa && file_name) && (id_cliente || produto === "wo")) {
        try {
            bucketName = `${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.toUpperCase()}/${file_name}`;


            const blob = bucket.file(bucketName);
            blob.exists(async(err, exists) => {
                if (exists) {
                    if (await bucket.file(bucketName).delete()) {
                        res.status(200).json({
                            message: "Arquivo excluído permanentemente com sucesso.",
                            status: "success"
                        })
                    }
                } else {
                    res.status(404).json({
                        // message: "Parâmetros ausentes ou arquivo não encontrado."
                        message: bucketName
                    });
                }
            })
        } catch (e) {
            res.status(500).send();
        }
    } else {
        res.status(404).json({
            // message: "Parâmetros ausentes ou arquivo não encontrado."
            message: `Sem cliente e empresa ${produto.toUpperCase()}/${id_empresa}/${id_cliente}/${file_path.toUpperCase()}/${file_name}`
        });
    }

})

routes.get('/link-url', async(req, res) => {

    let { file_url } = req.query

    if (file_url) {
        try {
            bucketName = file_url;
            const blob = bucket.file(bucketName);
            blob.exists(async(err, exists) => {
                if (exists) {
                    res.status(200).json({
                        url: await bucket.file(bucketName).getSignedUrl({
                            version: 'v2',
                            action: 'read',
                            expires: Date.now() + 1000 * 60 * 60,
                        }),
                        expiresIn: new Date(Date.now() + 1000 * 60 * 60).toLocaleString()
                    })
                } else {
                    res.status(404).json({
                        message: "Parâmetros ausentes ou arquivo não encontrado."
                    });
                }
            })
        } catch (e) {
            console.log(e)
            res.status(500).send();
        }
    } else {
        res.status(404).json({
            message: "Parâmetros ausentes ou arquivo não encontrado."
        });
    }

})

module.exports = { uploadFile, deleteFile, getLinkUrl, uploadFileBucketFilesToDownload, getLinkUrlFilesToDownload, deleteFileToDownload, routes }