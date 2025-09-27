const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;
const CAMINHO_ARQUIVO = "./livros.json";
app.use(express.json()); // Middleware para interpretar JSON no corpo da requisição


if (!fs.existsSync(CAMINHO_ARQUIVO)) {

    fs.writeFileSync(CAMINHO_ARQUIVO,"[]");
    
}

app.post("/livros", (req, res)=>{

    try {
        const {nome, autor, preco} = req.body;

        if (nome == "" || nome == undefined || preco == undefined || isNaN(preco) || autor == "" || autor == undefined) {
            return res.status(400).json({message: "Campos obrigatorios não preenchidos!"})
        }

        const data = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
        const livros = JSON.parse(data);

        const novoLivro = {
            id: livros.length + 1,
            nome,
            preco,
            autor
        }

        livros.push(novoLivro);

        fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(livros, null, 4))

        res.status(201).json({
            message: `Livro cadastrado com sucesso!`,
            livros: novoLivro
        });

    } catch (error) {
        
        console.error(`Erro ao cadastrar produto ${error}`);
        res.status(500).json({message: `Erro interno no servidor`});

    }

});

app.listen(PORT, ()=>{

    console.log(`Servidor rodando na porta ${PORT}`);

});