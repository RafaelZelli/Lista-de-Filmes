// Filme Class - Representa o objeto filme
class Filmes{
    constructor(titulo, genero, id){
        this.titulo = titulo;
        this.genero = genero;
        this.id = id;
    }
}

// Interface Usuario Class 
class UI{
    static displayFimes(){
        const filmes = Armazenamento.getFilmes();

        // Faz um loop na array de filme e depois adiciona o filme na lista 
        filmes.forEach((filme) => UI.addFilmesNaLista(filme));
    }

    static addFilmesNaLista(filme){
        const lista = document.getElementById("lista-filmes");
        // Criando a tabela
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${filme.titulo}</td>
            <td>${filme.genero}</td>
            <td>${filme.id}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        lista.appendChild(row)
    }

    //Remover filme da lista    
    static removerFilme(el){
        if(el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }

    //Mostra um campo de Alerta em cima do Titulo
    static mostraAlerta(mensagem, className){
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensagem));
        const container = document.querySelector(".container");
        const form = document.getElementById("filmes-form");
        container.insertBefore(div, form);
        //Deixar o alerta exibido por 2 segundos
        setTimeout(() => document.querySelector(".alert").remove(),2000);
    }

    //Limpar campos de input
    static limpaInput(){
        document.getElementById("titulo").value = "";
        document.getElementById("genero").value = "";
        document.getElementById("id").value = "";
    }
}

// Armazenamento no LocalStorage
class Armazenamento{
    static getFilmes(){
        let filmes;
        if(localStorage.getItem("filmes") === null ){
            filmes = [];
        }else{
            filmes = JSON.parse(localStorage.getItem("filmes"));
        }
        return filmes;
    }

    static addFilme(filme){
        const filmes = Armazenamento.getFilmes();
        filmes.push(filme);
        localStorage.setItem("filmes",JSON.stringify(filmes));
    }

    static removeFilme(id){
        const filmes = Armazenamento.getFilmes();
        filmes.forEach((filme, index) => {
            if(filme.id === id){
                filmes.splice(index, 1);
            }
        });
        localStorage.setItem("filmes",JSON.stringify(filmes));
    }
}

// Event - Mostra filme
document.addEventListener("DOMContentLoaded", UI.displayFimes);

// Event - Add filme
document.getElementById("filmes-form").addEventListener("submit", (e) => {
    //Prevent default do submit
    e.preventDefault();

    // Pega os inputs do formulario
    const titulo = document.getElementById("titulo").value;
    const genero = document.getElementById("genero").value;
    const id = document.getElementById("id").value;

    //Validar se os campos estão preenchidos
    if(titulo === "" || genero === "" || id === ""){
        UI.mostraAlerta("Preencha todos os campo do formulário", "danger");
    }else{
    //Filmes instaticos
    const filme = new Filmes(titulo, genero, id);

    //Adiciona Filme na UI
    UI.addFilmesNaLista(filme);

    //Adiciona Filme no LocalStorage
    Armazenamento.addFilme(filme);

    //Mostra uma mensagem de sucesso quando o filme for adicionado 
    UI.mostraAlerta("Filme Adicionado", "success");

    //Limpa os campos de input depois do submit
    UI.limpaInput();
    }    
});

// Event - Remove filme
document.getElementById("lista-filmes").addEventListener("click",(e) => {
    //Remove Filme da UI
    UI.removerFilme(e.target);

    //Remove filmes do Armazenamento (LocalStorage)
    Armazenamento.removeFilme(e.target.parentElement.previousElementSibling.textContent);

    //Mostra uma mensagem quando o filme for removido 
    UI.mostraAlerta("Filme Removido", "info");
})
