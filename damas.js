const tamanhoCelula = 40;
let pecaId = 0;
let tabuleiro = [[],[],[],[],[],[],[],[]]
let pendulo = 0
let stack = [0, 0, 0]
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

function bloqueiaPretas(except=[]) {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        (peca.id.charAt(0) == "b" && !except.includes(peca.id)) ?  peca.draggable = false : peca.draggable = peca.draggable ;
    });
}

function bloqueiaVermelhas(except=[]) {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        (peca.id.charAt(0) == "r" && !except.includes(peca.id)) ?  peca.draggable = false : peca.draggable = peca.draggable ;
    });
}

function desbloqueiaPretas() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        (peca.id.charAt(0) == "b" ) ?  peca.draggable = true : peca.draggable = peca.draggable ;
    });
}

function desbloqueiaVermelhas() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        (peca.id.charAt(0) == "r") ?  peca.draggable = true : peca.draggable = peca.draggable ;
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

function posiveisJogadas(pecaid, comerPraTras=false){
    let pos = getPosicao(pecaid)
    let posJogadas = []
    let sentido = 0
    let tipoSentido = [-1,1]
    if (!comerPraTras){
        tipoSentido = [tipoSentido[pendulo]]
    } 
    const contrario = ["b", "r"]
    for (let i = 0; i < tipoSentido.length; i++){
        sentido = tipoSentido[i]
        if (isEven(pos["i"])  &&  pos["j"] > 0){
            if(((pendulo == 0 && pos["i"] > 0) || (pendulo == 1 && pos["i"] < 7 )) && tabuleiro[pos["i"]+sentido][pos["j"]-1][1] == 0){
                posJogadas.push(tabuleiro[pos["i"]+sentido][pos["j"]-1][0])
            } else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && (tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][1] == 0) && typeof tabuleiro[pos["i"]+sentido][pos["j"]-1][1] != "number"){
                if(tabuleiro[pos["i"]+sentido][pos["j"]-1][1].charAt(0) == contrario[pendulo]){
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][0], tabuleiro[pos["i"]+sentido][pos["j"]-1][0]])
                }
            }
            if(((pendulo == 0 && pos["i"] > 0) || (pendulo == 1 && pos["i"] < 7 )) && tabuleiro[pos["i"]+sentido][pos["j"]][1] == 0){
                posJogadas.push(tabuleiro[pos["i"]+sentido][pos["j"]][0])
            } else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && pos["j"] < 3 && (tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][1] == 0 ) && typeof tabuleiro[pos["i"]+sentido][pos["j"]][1] != "number"){
                if (tabuleiro[pos["i"]+sentido][pos["j"]][1].charAt(0) == contrario[pendulo]) {
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][0], tabuleiro[pos["i"]+sentido][pos["j"]][0]])
                }
            }
        } else if (!isEven(pos["i"])  &&  pos["j"] < 3){
            if(((pendulo == 0 && pos["i"] > 0) || (pendulo == 1 && pos["i"] < 7 )) && tabuleiro[pos["i"]+sentido][pos["j"]][1] == 0){
                posJogadas.push(tabuleiro[pos["i"]+sentido][pos["j"]][0])
            } else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && (pos["j"] > 0 && tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][1] == 0)  && typeof tabuleiro[pos["i"]+sentido][pos["j"]][1] != "number"){
                if (tabuleiro[pos["i"]+sentido][pos["j"]][1].charAt(0) == contrario[pendulo]){
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][0], tabuleiro[pos["i"]+sentido][pos["j"]][0]])
                }
            }
            if(((pendulo == 0 && pos["i"] > 0) || (pendulo == 1 && pos["i"] < 7 )) && tabuleiro[pos["i"]+sentido][pos["j"]+1][1] == 0){
                posJogadas.push(tabuleiro[pos["i"]+sentido][pos["j"]+1][0])
            } else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && (tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][1] == 0) && typeof tabuleiro[pos["i"]+sentido][pos["j"]+1][1] != "number"){
                if(tabuleiro[pos["i"]+sentido][pos["j"]+1][1].charAt(0) == contrario[pendulo]){
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][0], tabuleiro[pos["i"]+sentido][pos["j"]+1][0]])
                }
            }
        } else if ((isEven(pos["i"])  &&  pos["j"] == 0) || (!isEven(pos["i"])  &&  pos["j"] == 3)){
            if(((pendulo == 0 && pos["i"] > 0) || (pendulo == 1 && pos["i"] < 7 )) && tabuleiro[pos["i"]+sentido][pos["j"]][1] == 0){
                posJogadas.push(tabuleiro[pos["i"]+sentido][pos["j"]][0])
            } else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && pos["j"] == 0 && (tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][1] == 0) && typeof tabuleiro[pos["i"]+sentido][pos["j"]][1] != "number"){
                if(tabuleiro[pos["i"]+sentido][pos["j"]][1].charAt(0) == contrario[pendulo]){
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]+1][0], tabuleiro[pos["i"]+sentido][pos["j"]][0]])
                }
            }  else if (((pendulo == 0 && pos["i"] > 1) || (pendulo == 1 && pos["i"] < 6 )) && pos["j"] == 3 && (tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][1] == 0) && typeof tabuleiro[pos["i"]+sentido][pos["j"]][1] != "number"){
                if (tabuleiro[pos["i"]+sentido][pos["j"]][1].charAt(0) == contrario[pendulo]){
                    posJogadas.push(["c", tabuleiro[pos["i"]+2*(sentido)][pos["j"]-1][0], tabuleiro[pos["i"]+sentido][pos["j"]][0]])
                }
            }
        }
    }
    if (checaCome(posJogadas)){
        posJogadas = somenteCome(posJogadas)
    }
    return posJogadas
}

function posiveisJogadasDama(pecaid){
    let pos = getPosicao(pecaid)
    let posJogadas = []
    if (pos["i"] != 0){
        if (pos["j"] > 0 || !isEven(pos["i"])){
            posJogadas = diagonal(pos, posJogadas, 0)
        } 
        if (pos["j"] < 7 || isEven(pos["i"])){
            posJogadas = diagonal(pos, posJogadas, 1)
        }
    }
    if (pos["i"] != 7){
        if (pos["j"] > 0 || !isEven(pos["i"])){
            posJogadas = diagonal(pos, posJogadas, 2)
        } 
        if (pos["j"] < 7 || isEven(pos["i"])){
            posJogadas = diagonal(pos, posJogadas, 3)
        }
    }
    if (checaCome(posJogadas)){
        posJogadas = somenteCome(posJogadas)
    }
    return posJogadas
}

function diagonal(pos, posJogadas, tipo){
    const contrario = ["b", "r"]
    const tipoI = [-1, -1, 1, 1]
    const tipoJ = [-1, 1, -1, 1]
    let i = pos["i"]
    let j = pos["j"]
    if ((isEven(tipo) &&  isEven(i)) || (!isEven(tipo) && !isEven(i))){
        j = j + tipoJ[tipo]
    } 
    i = i + tipoI[tipo]
    while (i!=8 && i != -1 &&  j!=4 && j!=-1){
        console.log(i,j)
        if (tabuleiro[i][j][1] == 0){
            posJogadas.push(tabuleiro[i][j][0])
        } else if ((j > 0 && j < 3) && (i>0 && i < 7)) {
            let proxJ = j
            if ((isEven(tipo) &&  isEven(i)) || (!isEven(tipo) && !isEven(i))){
                proxJ = j + tipoJ[tipo]
            }
            if(tabuleiro[i][j][1].charAt(0) == contrario[pendulo] && tabuleiro[i+tipoI[tipo]][proxJ][1] == 0){
                posJogadas.push(["c", tabuleiro[i+tipoI[tipo]][proxJ][0], tabuleiro[i][j][0]])
            }
            break
        }
        if ((isEven(tipo) &&  isEven(i)) || (!isEven(tipo) && !isEven(i))){
            j = j + tipoJ[tipo]
        } 
        i = i + tipoI[tipo]
    }
    return posJogadas
}

function somenteCome(posJogadas){
    let posJogadas2 = []
    for (let i = 0;  i < posJogadas.length; i ++){
        if (Array.isArray(posJogadas[i])){
            posJogadas2.push(posJogadas[i])
        }
    }
    return posJogadas2
}

function checaCome(posJogadas){
    for (let i = 0; i < posJogadas.length; i ++){
        if (Array.isArray(posJogadas[i])){
            return true
        }
    }
    return false
}

function percorrePecas(cor){
    let pecas = []
    for (let i = 0; i < tabuleiro.length; i++){
        for (let j = 0; j < tabuleiro[i].length; j ++){
            if (tabuleiro[i][j][1] != 0 && tabuleiro[i][j][1].charAt(0) == cor){
                pecas.push(tabuleiro[i][j][1])
            }
        }
    }
    return pecas
}

function pecasCome(){
    const pecas = []
    const cor = ["r", "b"]
    let pecasCor = percorrePecas(cor[pendulo])
    for (let i = 0; i < pecasCor.length; i++){
        let posJogadas = []
        if (pecasCor[i].charAt(pecasCor[i].length-1) == 'd'){
            posJogadas = posiveisJogadasDama(pecasCor[i])
        } else {
            posJogadas = posiveisJogadas(pecasCor[i])
        }
        if (checaCome(posJogadas)){
            pecas.push(pecasCor[i])
        }
    }
    return pecas
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

function validaMovimento(peca, mov, posJogadas){
    for (let i = 0; i < posJogadas.length; i ++){
        if (typeof posJogadas[i] == "string" && mov == posJogadas[i]){
            return true
        } else if (mov == posJogadas[i][1]) {
            const pos = getPosicaoCampo(posJogadas[i][2])
            removerPeca(pos)
            stack[0] = peca
            stack[1]++
            if (stack[1] == 1){
                stack[2] = proximoCome(peca, posJogadas[i][1])
            } else {
                stack[2] = 0
            }
            return true
        }
    }
    return false
}

function getCampo(peca){
    for (let i = 0; i < tabuleiro.length; i++){
        for (let j = 0; j < tabuleiro[i].length; j++){
            if(tabuleiro[i][j][1] == peca){
                return tabuleiro[i][j][0]
            }
        }
    }
    return false
}

function proximoCome(peca, campo2){
    const campo1 = getCampo(peca)
    const j1 = Number(campo1.charAt(4))
    const i2 = Number(campo2.charAt(1))
    const j2 = Number(campo2.charAt(4))
    let i = 0
    if (pendulo == 0) {
        i = i2 - 2
    } else {
        i = i2 + 2
    }
    const j = j2 + Math.abs(j2 - j1)
    const pCampo = 'i' + i + '-j' + j
    return pCampo
}

function removeCome(campo, posJogadas){
    let posJogadas2 = []
    for (let i = 0; i < posJogadas.length; i++){
        if(posJogadas[i][1] != campo){
            posJogadas2.push(posJogadas[i])
        }
    }
    return posJogadas2
}

function promoverpDama(){
    for(let i = 0; i < tabuleiro.length; i++){
        for(let j = 0; j < tabuleiro[i].length; j++){
            if (tabuleiro[i][j][1] != 0){
                if(i==0 && tabuleiro[i][j][1].charAt(0) == "r" && !ehDama(tabuleiro[i][j][1])){
                    const peca = document.querySelector(`#${tabuleiro[i][j][1]}`)
                    tabuleiro[i][j][1] = tabuleiro[i][j][1] + "d"
                    peca.id = tabuleiro[i][j][1]
                    peca.setAttribute('src', `img/red_dama.png`);
                }  else if (i==7 && tabuleiro[i][j][1].charAt(0) == "b" && !ehDama(tabuleiro[i][j][1])){
                    const peca = document.querySelector(`#${tabuleiro[i][j][1]}`)
                    tabuleiro[i][j][1] = tabuleiro[i][j][1] + "d"
                    peca.id = tabuleiro[i][j][1]
                    peca.setAttribute('src', `img/black_dama.png`);
                }
            }
        }
    }
}

function ehDama(peca){
    if (peca.charAt(peca.length -1) == "d"){
        return true
    } else {
        return false
    }
}

function jogadorDaVez() {
    let pecas = null
    if (stack[0] != 0){
        let posJogadas = []
        if (stack[0].charAt(stack[0].length-1) == 'd'){
            posJogadas = posiveisJogadasDama(stack[0])
        } else {
            posJogadas = posiveisJogadas(stack[0], true)
        }
        if (stack[0].charAt(stack[0].length-1) == 'd' && stack[2] != 0){
            posJogadas = removeCome(stack[2], posJogadas)
        }
        if (pendulo == 1){
            inverterPendulo()
            pecas = pecasCome()
            if (!checaCome(posJogadas)){
                desbloqueiaVermelhas()
                bloqueiaPretas()
                if (pecas.length > 0){
                    bloqueiaVermelhas(pecas)
                }
                stack[0] = 0
                stack[1] = 0
                stack[2] = 0
            } else {
                inverterPendulo()
                bloqueiaVermelhas([stack[0]])
            }
        } else{
            inverterPendulo()
            pecas = pecasCome()
            if (!checaCome(posJogadas)){
                desbloqueiaPretas()
                bloqueiaVermelhas()
                if (pecas.length > 0){
                    bloqueiaPretas(pecas)
                }
                stack[0] = 0
                stack[1] = 0
                stack[2] = 0
            } else {
                inverterPendulo()
                bloqueiaPretas([stack[0]])
            }
        }
    } else {
        inverterPendulo()
        pecas = pecasCome()
        if (pendulo == 0){
            desbloqueiaVermelhas()
            bloqueiaPretas()
            if (pecas.length > 0){
                bloqueiaVermelhas(pecas)
            }
        } else {
            desbloqueiaPretas()
            bloqueiaVermelhas()
            if (pecas.length > 0){
                bloqueiaPretas(pecas)
            }
        }
    }
    promoverpDama()
}

function drop(ev) {
    const imgid= ev.dataTransfer.getData("imgid");
    const imagem = document.querySelector(`#${imgid}`)
    let posJogadas = []
    if (imgid.charAt(imgid.length-1) == "d"){
        posJogadas = posiveisJogadasDama(imgid)
    } else if(stack[2] == 0){
        posJogadas = posiveisJogadas(imgid)
    } else {
        posJogadas = posiveisJogadas(imgid, true)
    }
    const dropid = ev.target.id
    if (validaMovimento(imgid, dropid, posJogadas)) {
        const posInicial = getPosicao(imgid)
        const posicaoFinal = getPosicaoCampo(dropid)
        moverPeca(posInicial, posicaoFinal)
        imagem.parentElement.addEventListener('dragover', allowDrop)
        ev.target.appendChild(imagem);
        ev.target.removeEventListener('dragover', allowDrop)
        jogadorDaVez()
    }
}
