const tamanhoCelula = 40;
let pecaId = 0;
let tabuleiro = [[],[],[],[],[],[],[],[]]
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
                    tabuleiro[i].push([celula.id, undefined])
                }
            } else {
                celula.style.backgroundColor = 'white';
            }
        }
    };
    return tabela;
}

function jogadorDaVez() {
    const pecas = document.querySelectorAll('.peca')
    pecas.forEach(peca => {
        peca.draggable = !peca.draggable
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
    const pecas = document.querySelectorAll('.peca')
    ev.dataTransfer.setData("imgid", ev.target.id);
}

function drop(ev) {
    const imgid= ev.dataTransfer.getData("imgid");
    const imagem = document.querySelector(`#${imgid}`)
    const pos = ev.dataTransfer.getData("pos");
    const nPos = ev.target.id
    let sentido = -1
    const i1 = Number(pos.charAt(1))
    const j1 = Number(pos.charAt(4))
    const i2 = Number(nPos.charAt(1))
    const j2 = Number(nPos.charAt(4))
    if (imgid.charAt(0) == "b"){
        sentido = 1
    } 
    if ((i1+sentido==i2) && (j2 == j1+1 || j2 == j1-1)) {
        imagem.parentElement.addEventListener('dragover', allowDrop)
        ev.target.appendChild(imagem);
        ev.target.removeEventListener('dragover', allowDrop)
        jogadorDaVez()
    }

}

