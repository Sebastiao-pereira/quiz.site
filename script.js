let currentQuestion = 0;
let usuario = "";
let respostasUsuario = [];

function iniciarQuiz() {
    usuario = document.getElementById("nome").value.trim();
    if (usuario === "") {
        alert("Digite seu nome para iniciar!");
        return;
    }
    document.getElementById("inicio").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    mostrarPergunta();
}

function mostrarPergunta() {
    const q = questoes[currentQuestion];
    const container = document.getElementById("pergunta-container");

    document.getElementById("pergunta").innerText = q.pergunta;

    const opcoesDiv = document.getElementById("opcoes");
    opcoesDiv.innerHTML = "";

    q.opcoes.forEach((opcao, index) => {
        const button = document.createElement("button");
        button.innerText = opcao;
        button.classList.add("opcao-btn");
        button.onclick = () => selecionarOpcao(index);
        opcoesDiv.appendChild(button);
    });

    document.getElementById("proxima").disabled = true;

    container.classList.remove("show");
    setTimeout(() => container.classList.add("show"), 50);
}

function selecionarOpcao(index) {
    const q = questoes[currentQuestion];

    const registro = {
        pergunta: q.pergunta,
        respostaEscolhida: q.opcoes[index],
        correta: q.opcoes[q.correta],
        acertou: index === q.correta
    };

    const existente = respostasUsuario.find(r => r.pergunta === q.pergunta);
    if (existente) {
        const pos = respostasUsuario.indexOf(existente);
        respostasUsuario[pos] = registro;
    } else {
        respostasUsuario.push(registro);
    }

    // Destacar visualmente a opção selecionada
    const botoes = document.querySelectorAll(".opcao-btn");
    botoes.forEach((btn, i) => {
        if (i === index) btn.classList.add("selecionada");
        else btn.classList.remove("selecionada");
    });

    document.getElementById("proxima").disabled = false;
}

function proximaPergunta() {
    currentQuestion++;
    if (currentQuestion < questoes.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    const total = questoes.length;
    const acertos = respostasUsuario.filter(r => r.acertou).length;
    const erros = total - acertos;
    const percentual = Math.round((acertos / total) * 100);

    document.getElementById("quiz").style.display = "none";
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.style.display = "block";

    document.getElementById("nome-usuario").innerText = usuario;
    document.getElementById("acertos").innerText = acertos;
    document.getElementById("erros").innerText = erros;
    document.getElementById("percentual").innerText = percentual;

    let mensagem = "";
    if (percentual >= 80) mensagem = "Excelente!";
    else if (percentual >= 50) mensagem = "Bom desempenho";
    else mensagem = "Precisa melhorar";
    document.getElementById("mensagem").innerText = mensagem;

    // Gráfico
    const ctx = document.getElementById("graficoDesempenho").getContext("2d");
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                data: [acertos, erros],
                backgroundColor: ['#4caf50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Tabela de resultados
    const detalhesDiv = document.createElement("div");
    detalhesDiv.innerHTML = "<h3>Detalhes das Respostas:</h3>";

    const tabela = document.createElement("table");
    tabela.innerHTML = `
        <tr>
            <th>#</th>
            <th>Pergunta</th>
            <th>Sua Resposta</th>
            <th>Resposta Correta</th>
            <th>Resultado</th>
        </tr>
    `;

    // Garantir ordem correta (pergunta 1..n). Se quiser manter a ordem original:
    // percorre questoes e busca em respostasUsuario a resposta correspondente.
    questoes.forEach((q, i) => {
        const res = respostasUsuario.find(r => r.pergunta === q.pergunta);
        const tr = document.createElement("tr");

        // Se o usuário não respondeu (não deveria acontecer, pois "Próxima" só habilita após escolher),
        // trataremos como erro sem resposta.
        if (!res) {
            tr.style.backgroundColor = "#fff3cd"; // amarelo claro - não respondida
            tr.innerHTML = `
                <td style="text-align:center;">${i + 1}</td>
                <td>${q.pergunta}</td>
                <td>—</td>
                <td></td>
                <td style="text-align:center;">—</td>
            `;
        } else {
            tr.style.backgroundColor = res.acertou ? "#d4edda" : "#f8d7da";
            const respostaCorreta = res.acertou ? res.correta : "";
            tr.innerHTML = `
                <td style="text-align:center;">${i + 1}</td>
                <td>${res.pergunta}</td>
                <td>${res.respostaEscolhida}</td>
                <td>${respostaCorreta}</td>
                <td style="text-align:center;">${res.acertou ? "✔ Acertou" : "❌ Errou"}</td>
            `;
        }

        tabela.appendChild(tr);
    });

    detalhesDiv.appendChild(tabela);

    // Botão refazer quiz
    const botaoRefazer = document.createElement("button");
    botaoRefazer.innerText = "Refazer Quiz";
    botaoRefazer.style.marginTop = "20px";
    botaoRefazer.onclick = reiniciarQuiz;
    detalhesDiv.appendChild(botaoRefazer);

    // limpar resultados antigos se existirem e adicionar novos
    while (resultadoDiv.firstChild) {
        
        break;
    }

    // caso já exista um detalhes anterior dentro do resultado, removemos (prevenção)
    const existenteDetalhes = resultadoDiv.querySelector("div");
    if (existenteDetalhes) {
        resultadoDiv.removeChild(existenteDetalhes);
    }

    resultadoDiv.appendChild(detalhesDiv);
    setTimeout(() => resultadoDiv.classList.add("show"), 50);
}

function reiniciarQuiz() {
    currentQuestion = 0;
    respostasUsuario = [];

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.style.display = "none";
    resultadoDiv.classList.remove("show");

    document.getElementById("inicio").style.display = "block";
    document.getElementById("nome").value = "";

    // Remover detalhes antigos se houver
    const existenteDetalhes = resultadoDiv.querySelector("div");
    if (existenteDetalhes) {
        resultadoDiv.removeChild(existenteDetalhes);
    }
}
