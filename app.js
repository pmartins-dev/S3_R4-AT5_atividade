const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const CAMINHO_ARQUIVO = "./livros.json";
app.use(express.json()); // Middleware para interpretar JSON no corpo da requisição


if (!fs.existsSync(CAMINHO_ARQUIVO)) {

    fs.writeFileSync(CAMINHO_ARQUIVO, "[]");

}

app.get("/livros", (req, res) => {

    try {
        // Lendo o arquivo JSON
        const data = fs.readFileSync('./livros.json', 'utf-8');

        // Transformando o JSON em objeto JS
        let livros = JSON.parse(data);

        const { tituloDoLivro } = req.query;

        if (tituloDoLivro) {
            // filter vai manter somente os produtos que se atender a condição
            livros = livros.filter(livro =>
                livro.tituloDoLivro.toLowerCase() // converte para minusculo 
                    .includes(tituloDoLivro.toLowerCase()))
        }

        res.status(200).json(livros);



    } catch (error) {
        console.error('Erro ao ler arquivo JSON', error);
        res.status(500).json({ message: 'Erro interno no servidor' });

    }

});

app.post("/livros", (req, res) => {

    try {
        const { tituloDoLivro, autor, anoDaPublicacao, qtdDisponivel } = req.body;

        //Verificando se todos os dados foram enviados
        if (tituloDoLivro == "" || tituloDoLivro == undefined || autor == "" || autor == undefined || anoDaPublicacao == undefined || isNaN(anoDaPublicacao) || qtdDisponivel == undefined || isNaN(qtdDisponivel)) {
            return res.status(400).json({ message: "Campos obrigatorios não preenchidos!" })
        }

        const data = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
        const livros = JSON.parse(data);
        
        //Cria um novo livro
        const novoLivro = {
            id: livros.length + 1,
            tituloDoLivro,
            autor,
            anoDaPublicacao,
            qtdDisponivel
        }

        livros.push(novoLivro);

        fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(livros, null, 4))

        res.status(201).json({
            message: `Livro cadastrado com sucesso!`,
            livros: novoLivro
        });

    } catch (error) {

        console.error(`Erro ao cadastrar produto ${error}`);
        res.status(500).json({ message: `Erro interno no servidor` });

    }

});

app.listen(PORT, () => {

    console.log(`Servidor rodando na porta http://localhost:${PORT}`);

});