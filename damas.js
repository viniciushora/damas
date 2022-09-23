const tamanhoCelula = 40;
let pecaId = 0;
let tabuleiro = [[],[],[],[],[],[],[],[]]
let pendulo = 0
document.body.append(criaTabuleiro());

function criaTabuleiro() {
    const tamanho = 8;
    let tabela = document.createElement('table');

    tabela.style.borderStyle = 'solid';
    tabela.style.borderSpacing = 0;
    tabela.style.margin = 'auto';

    for (let i = 0; i < tamanho; i++) {
        let linha = document.createElement('tr');
        tabela.append(linha);
        for (let j = 0; j < tamanho; j++) {
            let celula = document.createElement('td');
            celula.addEventListener('drop', drop)
            linha.append(celula);

            celula.style.width = `${tamanhoCelula}px`;
            celula.style.height = `${tamanhoCelula}px`;
            if (i % 2 == j % 2) {
                celula.addEventListener('dragover', allowDrop)
                celula.style.backgroundColor = 'black';
                celula.id = `i${i}-j${j}`
                if (i * 8 + j <= 24) {
                    const peca = criaPeca('black')
                    peca.id = `b-i${i}-j${j}`
                    celula.append(peca)
                    celula.removeEventListener('dragover', allowDrop)
                    tabuleiro[i][j] = [celula.id, peca.id]
                } else if (i * 8 + j >= 40) {
                    const peca = criaPeca('red')
                    peca.id = `r-i${i}-j${j}`
                    peca.draggable = true
                    celula.append(peca)
                    tabuleiro[i][j] = [celula.id, peca.id]
                    celula.removeEventListener('dragover', allowDrop)
                } else {
                    tabuleiro[i].push([celula.id, 0])
                }
            } else {
                celula.style.backgroundColor = 'white';
            }
        }
    };
    tabuleiro = retirarVazios(tabuleiro)
    return tabela;
}

function retirarVazios(lista){
    for(let i=0; i<lista.length;i++){
        lista[i] = lista[i].filter((a) => a);
    }
    return lista
}

function jogadorDaVez() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        peca.draggable = !peca.draggable
    });
}

function bloqueiaPretas(except=undefined) {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        if (peca.id.charAt(0) == "b" && !except.includes(peca.id)){
            peca.draggable = false
        }
    });
}

function bloqueiaVermelhas(except=undefined) {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        if (peca.id.charAt(0) == "r" && !except.includes(peca.id)){
            peca.draggable = false
        }
    });
}

function criaPeca(cor) {
    let imagem = document.createElement('img');
    imagem.classList.add('peca')
    imagem.setAttribute('src', `img/${cor}.png`);
    imagem.setAttribute('width', `${tamanhoCelula-4}px`);
    imagem.setAttribute('height', `${tamanhoCelula-4}px`);
    imagem.setAttribute('draggable', 'false')
    imagem.addEventListener('dragstart', drag)
    return imagem;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("imgid", ev.target.id);
}

function posiveisJogadas(pecaid){
    const pos = getPosicao(pecaid)
    const posJogadas = []
    const sentido = [-1,1]
    const contrario = ["b", "r"]
    if (isEven(pos["i"])  &&  pos["j"] > 0){
        if(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]-1][1] == 0){
            posJogadas.push(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]-1][0])
        } else if ((tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]-1][1] == 0) && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]-1][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]-1][0], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]-1][0]])
        }
        if(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1] == 0){
            posJogadas.push(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0])
        } else if (pos["j"] < 3 && (tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][1] == 0 ) && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][0], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0]])
        }
    } else if (!isEven(pos["i"])  &&  pos["j"] < 3){
        if(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1] == 0){
            posJogadas.push(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0])
        } else if ((tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][1] == 0)  && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][1], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0]])
        }
        if(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]+1][1] == 0){
            posJogadas.push(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]+1][0])
        } else if ((pos["j"] > 0 && tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][1] == 0) && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]+1][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][0], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]+1][0]])
        }
    } else if ((isEven(pos["i"])  &&  pos["j"] == 0) || (!isEven(pos["i"])  &&  pos["j"] == 3)){
        if(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1] == 0){
            posJogadas.push(tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0])
        } else if (pos["j"] == 0 && (tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][1] == 0) && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]+1][0], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0]])
        }  else if (pos["j"] == 3 && (tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]-1][1] == 0) && tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][1].charAt(0) == contrario[pendulo]){
            posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido[pendulo])][pos["j"]-1][0], tabuleiro[pos["i"]+sentido[pendulo]][pos["j"]][0]])
        }
    }
    if (checaCome(posJogadas)){
        posJogadas = somenteCome(posJogadas)
    }
    return posJogadas
}

function somenteCome(posJogadas){
    for (let i = 0; i < posJogadas.length; i ++){
        if (typeof posJogadas[i] != "array"){
            delete posJogadas[i]
            i = i - 1
        }
    }
    return posJogadas
}

function checaCome(posJogadas){
    for (let i = 0; i < posJogadas.length; i ++){
        if (typeof posJogadas[i]== "array"){
            return true
        }
    }
    return false
}

function isEven(value) {
	if (value%2 == 0)
		return true;
	else
		return false;
}

function getPosicao(pecaid){
    for (let i = 0; i < tabuleiro.length; i++){
        for (let j = 0 ; j < tabuleiro[i].length; j++){
            if (tabuleiro[i][j][1] == pecaid){
                return {"i": i, "j": j}
            }
        }
    }
    return false
}

function getPosicaoCampo(campoid){
    for (let i = 0; i < tabuleiro.length; i++){
        for (let j = 0 ; j < tabuleiro[i].length; j++){
            if (tabuleiro[i][j][0] == campoid){
                return {"i": i, "j": j}
            }
        }
    }
    return false
}

function inverterPendulo(){
    if (pendulo == 0){
        pendulo = 1
    } else{
        pendulo = 0
    }
}

function moverPeca(posicao1, posicao2){
    tabuleiro[posicao2["i"]][posicao2["j"]][1] = tabuleiro[posicao1["i"]][posicao1["j"]][1]
    tabuleiro[posicao1["i"]][posicao1["j"]][1] = 0
}

function removerPeca(posicao){
    const peca = document.querySelector(`#${tabuleiro[posicao["i"]][posicao["j"]][1]}`)
    peca.parentElement.addEventListener('dragover', allowDrop)
    peca.remove()
    tabuleiro[posicao["i"]][posicao["j"]][1] = 0
}

function validaMovimento(mov, posJogadas){
    for (let i = 0; i < posJogadas.length; i ++){
        if (typeof posJogadas[i] == "string" && mov == posJogadas[i]){
            return true
        } else if (mov == posJogadas[i][1]) {
            const pos = getPosicaoCampo(posJogadas[i][2])
            removerPeca(pos)
            return true
        }
    }
    return false
}

function drop(ev) {
    const imgid= ev.dataTransfer.getData("imgid");
    const imagem = document.querySelector(`#${imgid}`)
    const posJogadas = posiveisJogadas(imgid)
    const dropid = ev.target.id
    if (validaMovimento(dropid, posJogadas)) {
        const posInicial = getPosicao(imgid)
        const posicaoFinal = getPosicaoCampo(dropid)
        moverPeca(posInicial, posicaoFinal)
        imagem.parentElement.addEventListener('dragover', allowDrop)
        ev.target.appendChild(imagem);
        ev.target.removeEventListener('dragover', allowDrop)
        inverterPendulo()
        jogadorDaVez()
    }
}
