const mongodb = require('mongodb');
const ClienteMongo = mongodb.MongoClient;
let cliente;

const conexao_bd = async () => {
    if (!cliente)
        cliente = await ClienteMongo.connect('mongodb://127.0.0.1:27017');
}

const bd = () => {
    return cliente.db('livros');
}

class LivroMongo {
    async close() {
        if (cliente)
            cliente.close();
        cliente = undefined;
    }

    // crud livros
    async cadLivro(livro, progresso = 0) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        var dataCriacao = new Date();
        await colecao.insertOne({ titulo: livro.titulo, genero: livro.genero, texto: livro.texto, autor: livro.autor, editora: livro.editora, formato: livro.formato, progresso, dataCriacao });
    }

    async alteraLivro(livro) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        await colecao.updateOne({ _id: new mongodb.ObjectId(livro._id) }, { $set: { titulo: livro.titulo, genero: livro.genero, texto: livro.texto, autor: livro.autor, editora: livro.editora, formato: livro.formato } });
    }

    async consulta(id) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const livro = await colecao.findOne({ _id: new mongodb.ObjectId(id) });
        return livro;
    }

    async deleta(id) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const doc = await colecao.findOne({
            _id: new mongodb.ObjectId(id)
        });
        if (!doc) {
            throw new Error(`Este livro não existe`);
        } else {
            await colecao.findOneAndDelete({ _id: new mongodb.ObjectId(id) });
        }
    }

    // outros cruds
    async atualizarProgresso(id, percentual, comentario, dtI = null) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const livro = await colecao.findOne({ _id: new mongodb.ObjectId(id) });

        if (!livro) {
            throw new Error('Livro não encontrado');
        }

        if (percentual < livro.progresso) {
            throw new Error('O percentual não pode ser menor do que o progresso atual');
        }

        if (percentual > 100) {
            throw new Error('O progresso não pode exceder 100%');
        }

        const atualizacao = { percentual, comentario, data: new Date() };

        if (!livro.dataInicio) {
            atualizacao.dataInicio = dtI;
        }

        try {
            const updateFields = {
                $set: { progresso: percentual },
                $push: { progressoHistorico: atualizacao }
            };

            if (percentual === 100) {
                updateFields.$set.dataFim = atualizacao.data;
            }

            const resultado = await colecao.updateOne(
                { _id: new mongodb.ObjectId(id) },
                updateFields
            );
            return resultado;
        } catch (erro) {
            console.error('Erro ao adicionar progresso:', erro);
            throw erro;
        }
    }

    async criarResenha(id, titulo_resenha, resenha, estrela, dataFim = null, tag, progresso) {
        await conexao_bd();
        const colecao = bd().collection("livros");

        const livro = await colecao.findOne({ _id: new mongodb.ObjectId(id) });
        if (progresso) {
            await colecao.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { progresso: 100 } });
        }

        if (!livro) {
            throw new Error('Livro não encontrado');
        }

        const resenhaObj = {
            titulo_resenha,
            resenha,
            estrela,
            dataFim: dataFim || null,
            tag: tag
        };

        try {
            const updateFields = {
                $push: { resenha: resenhaObj }
            };

            const resultado = await colecao.updateOne(
                { _id: new mongodb.ObjectId(id) },
                updateFields
            );
            return resultado;
        } catch (erro) {
            console.error('Erro ao adicionar resenha:', erro);
            throw erro;
        }
    }

    async lista() {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const livros = await colecao.find({}).sort({ dataCriacao: -1 }).toArray();
        return livros;
    }

    async listaGenero(genero) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const livros = await colecao.find({ genero: genero }).toArray();
        return livros;
    }

    async listaFormato(formato) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const livros = await colecao.find({ formato: formato }).toArray();
        return livros;
    }

    async qtdGenero(genero) {
        await conexao_bd();
        const colecao = bd().collection("livros");
        const qtd = await colecao.count({ genero: genero });
        return qtd;
    }

    async qntFormato(Formato) {
        await conexao_bd()
        const colecao = bd().collection("livros")
        const qtd = await colecao.count({ formato: Formato })
        return qtd
    }

    async statusLivros() {
        await conexao_bd();
        const colecao = bd().collection("livros");

        // Livros com dataFim e tag "lido"
        const lidos = await colecao.countDocuments({
            resenha: {
                $elemMatch: {
                    dataFim: { $exists: true, $ne: null },
                    tag: 'lido'
                }
            }
        }); 

        // Livros com dataFim e tag "abandonado"
        const abandonado = await colecao.countDocuments({
            resenha: {
                $elemMatch: {
                    tag: 'abandonado'
                }
            }
        });


        const lendo = await colecao.countDocuments({
            progressoHistorico: {
                $elemMatch: {
                    dataInicio: { $exists: true, $ne: null }
                }
            },
            resenha: { $exists: false }
        });

        // Livros sem qualquer progresso (não lidos)
        const naoLidos = await colecao.countDocuments({
            progressoHistorico: {
                $not: {
                    $elemMatch: {
                        dataInicio: { $exists: true, $ne: null }
                    }
                }
            },
            resenha: {
                $not: {
                    $elemMatch: {
                        dataFim: { $exists: true, $ne: null }
                    }
                }
            }
        });


        return {
            lidos,
            lendo,
            naoLidos,
            abandonado
        };
    }

    async listaBusca(busca) {
        await conexao_bd()
        const colecao = bd().collection("livros")
        colecao.createIndex({ titulo: "text" })
        var anotacoes = await colecao.find({ $text: { $search: busca } }).sort({ titulo: 1 }).toArray()
        return anotacoes
    }

}

module.exports = new LivroMongo();
