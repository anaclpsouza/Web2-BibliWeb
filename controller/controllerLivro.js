const Livro = require('../model/livrosMongo.js');


exports.cadLivro_get = async function (req, res) {
    const contexto = {
        titulo_pagina: "Cadastro de Livros"
    };
    res.render('cadLivro', contexto);
};

exports.cadLivro = async function (req, res) {
    const titulo = req.body.titulo;
    const genero = req.body.genero;
    const texto = req.body.texto;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const tag = req.body.tag;

    try {
        await Livro.cadLivro(titulo, genero, texto, autor, editora, tag);
        res.redirect('/');
    } catch (erro) {
        console.log("nao cadastrado")
        res.redirect('/');
    }
};

exports.alteraLivro_get = async function (req, res) {

    const id = req.params._id
    const livro = await Livro.consulta(id);

    var ficcao = false;
    var romance = false;
    var fantasia = false;
    var distopia = false;
    var suspense = false;
    var terror = false;
    var outros = false;

    switch (livro.genero) {
        case "Ficcao":
            ficcao = true;
            break;
        case "Romance":
            romance = true;
            break;
        case "Fantasia":
            fantasia = true;
            break;
        case "Distopia":
            distopia = true;
            break;
        case "Suspense":
            suspense = true;
            break;
        case "Terror":
            terror = true;
            break;
        case "Outros":
            outros = true;
            break;
    }

    const contexto = {
        titulo_pagina: "Ateração de Livros",
        livro: livro,
        ficcao: ficcao,
        romance: romance,
        fantasia: fantasia,
        distopia: distopia,
        suspense: suspense,
        terror: terror,
        outros: outros
    };
    res.render('alteraLivro', contexto);
};

exports.alteraLivro = async function (req, res) {
    const titulo = req.body.titulo;
    const genero = req.body.genero;
    const texto = req.body.texto;
    const autor = req.body.autor;
    const editora = req.body.editora;
    const tag = req.body.tag;


    const id = req.params._id

    try {
        await Livro.alteraLivro(id, titulo, genero, texto, autor, editora, tag);
        res.redirect('/');

    } catch (erro) {
        console.log("nao cadastrado")
        res.redirect('/');
    }
};

exports.consulta = async function (req, res) {
    var id = req.params._id
    var livro = await Livro.consulta(id)

    let dataInicioV = false;
    let dataFimV = false;

    let dataInicioFormatada, dataFimFormatada;


    if (Array.isArray(livro.progressoHistorico) && livro.progressoHistorico.length > 0) {
        const dataInicio = new Date(livro.progressoHistorico[0].dataInicio);
        dataInicioFormatada = dataInicio.toLocaleDateString("pt-BR");
        livro.progressoHistorico[0].dataInicio = dataInicioFormatada;
        dataInicioV = true;
    }

    if (Array.isArray(livro.progressoHistorico) && livro.progressoHistorico.length > 0) {
        for (let i = 0; i < livro.progressoHistorico.length; i++) {
            const data = new Date(livro.progressoHistorico[i].data);
            var dataFormatada = data.toLocaleDateString("pt-BR");
            livro.progressoHistorico[i].data = dataFormatada;
        }
    }

    if (Array.isArray(livro.resenha) && livro.resenha.length > 0) {
        const dataFim = new Date(livro.resenha[0].dataFim);
        dataFimFormatada = dataFim.toLocaleDateString("pt-BR");
        livro.resenha[0].dataFim = dataFimFormatada;
        dataFimV = true;
    }

    const contexto = {
        titulo_pagina: "Detalhes",
        livro: livro,
        dataInicioV: dataInicioV,
        condicao: livro.progresso === 100,
        dt: dataInicioFormatada,
        dtF: dataFimFormatada,
        dataFimV: dataFimV
    };

    res.render('consultaLivro', contexto)
}

exports.get_atualizarProgresso = async function (req, res) {
    var id = req.params._id
    var livro = await Livro.consulta(id);
    let condicaoData

    if (!livro.progressoHistorico || !livro.progressoHistorico[0]?.dataInicio) {
        const dataInicio = req.body.dataInicio ? new Date(req.body.dataInicio) : null;
        if (!dataInicio) {
            condicaoData = true
        }
    }

    var condicao = false
    if (livro.resenha) {
        condicao = true;
    }

    var condicaoLivro = false
    if (livro.progresso === 100) {
        condicaoLivro = true;
    }

    const contexto = {
        titulo_pagina: "Atualizar Progresso",
        livros: livro,
        condicao: condicao,
        condicaoLivro: condicaoLivro,
        condicaoData: condicaoData
    };
    res.render('atualizarProgresso', contexto);
};


exports.post_atualizarProgresso = async function (req, res) {
    const livroId = req.params._id;
    const novoProgresso = parseInt(req.body.percentual);
    const comentario = req.body.comentario;
    const dataAtualizacao = new Date(); // Data da atualização
    const dataInicio = req.body.dataInicio ? new Date(req.body.dataInicio) : null;

    try {
        const livro = await Livro.consulta(livroId);

       
        if (novoProgresso < livro.progresso) {
            return res.render('error', { mensagem: "Progresso não pode ser menor que o já registrado." });
        }

       
        if (novoProgresso === 100) {
            await Livro.atualizarProgresso(livroId, novoProgresso, comentario, dataAtualizacao);
            
        }

        
        if (!livro.dataInicio && dataInicio) {
            await Livro.atualizarProgresso(livroId, novoProgresso, comentario, dataAtualizacao, dataInicio);
        } else {
            await Livro.atualizarProgresso(livroId, novoProgresso, comentario, null);
        }

        res.redirect(`/`);
    } catch (erro) {
        console.log(erro);
        res.render('error', { mensagem: "Erro ao atualizar o progresso." });
    }
};


exports.deleta = async function (req, res) {
    var id = req.params._id
    await Livro.deleta(id);

    res.redirect('/');
}

exports.get_criarResenha = async function (req, res) {
    var id = req.params._id
    var livro = await Livro.consulta(id)
  

    const contexto = {
        titulo_pagina: "Atualizar Progresso",
        livros: livro,
      

    };

    res.render('atualizarProgresso', contexto);
}


exports.post_criarResenha = async function (req, res) {
    const livroId = req.params._id;
    const tituloResenha = req.body.titulo_resenha;
    const resenhaTexto = req.body.resenha;
    const dataFim = new Date(req.body.dataFim + "T00:00:00"); 
    const tag = req.body.tag; 
    const estrelas = parseInt(req.body.estrela);

    if (req.body.dataInicio) {
        const dataInicio = new Date(req.body.dataInicio);
        await Livro.atualizarProgresso(livroId, null, null, dataInicio)
    }
 

    try {
        
        if (tag === 'lido') {
            await Livro.criarResenha(livroId, tituloResenha, resenhaTexto, estrelas, dataFim, 'lido');
            await Livro.atualizarProgresso(livroId, "100", null, null)
            return res.redirect('/');
        }

       
        if (tag === 'abandonado') {
            await Livro.criarResenha(livroId, tituloResenha, resenhaTexto, estrelas, dataFim, 'abandonado');
            return res.redirect('/');
        }

       
    } catch (erro) {
        console.log(erro);
        res.render('error', { mensagem: "Erro ao criar a resenha." });
    }
};


