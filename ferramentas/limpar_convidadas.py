"""Limpeza localizada das folhas da Mariana e da Marcela (18/11/2026).

Roda sobre as folhas já exportadas por preparar_convidadas.py e só torna pixels transparentes.
Três regras, cada uma restrita a uma região para não repetir as manchas do preenchimento global:

1. Halo: pixel claro e pouco saturado na borda do recorte, encostado em contorno escuro.
   Pele (saturada) e o interior do corpo ficam intactos.
2. Vão entre as pernas: faixa estreita (até 5 px) de cinza/branco neutro presa entre partes escuras,
   da altura do quadril até o topo dos tênis.
3. Entre os tênis: regiões claras ou bege (fundo e sombra de chão da prancha) cujo centro fica fora das
   caixas dos dois tênis. Cadarços e detalhes dentro dos tênis são preservados.

Uso: python3 ferramentas/limpar_convidadas.py   (sobrescreve as folhas; confira as prévias antes de publicar)
"""
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage

QUADRO = (110, 180)
INICIO_PERNAS = 120


def lum(rgb):
    return rgb @ np.array([.299, .587, .114])


def limpar_quadro(q):
    a = q.copy()
    rgb = a[:, :, :3].astype(float)
    alfa = a[:, :, 3] > 0
    L = lum(rgb)
    sat = rgb.max(2) - rgb.min(2)
    h = a.shape[0]
    removido = np.zeros(alfa.shape, bool)

    # topo dos tênis: primeira linha (de cima, abaixo do quadril) com muitos pixels claros
    claros = (L >= 150) & alfa
    topo = h
    for y in range(INICIO_PERNAS, h):
        if claros[y].sum() >= 8:
            topo = y
            break

    # 2. vão entre as pernas
    escuro = alfa & (L < 70)
    neutro = alfa & (L >= 60) & (sat <= 24)
    for y in range(INICIO_PERNAS, topo):
        x = 0
        while x < QUADRO[0]:
            if neutro[y, x]:
                x2 = x
                while x2 + 1 < QUADRO[0] and neutro[y, x2 + 1]:
                    x2 += 1
                if x2 - x + 1 <= 5 and x > 0 and x2 + 1 < QUADRO[0] and escuro[y, x - 1] and escuro[y, x2 + 1]:
                    removido[y, x:x2 + 1] = True
                x = x2 + 1
            else:
                x += 1

    # 3. entre os tênis
    zona = np.zeros(alfa.shape, bool)
    zona[max(topo - 2, 0):, :] = True
    claro_zona = alfa & (L >= 90) & zona
    rot, n = ndimage.label(claro_zona, structure=np.ones((3, 3)))
    if n >= 2:
        tamanhos = ndimage.sum(claro_zona, rot, range(1, n + 1))
        tenis = np.argsort(tamanhos)[::-1][:2] + 1
        caixas = []
        for k in tenis:
            ys, xs = np.where(rot == k)
            caixas.append((xs.min(), xs.max()))
        for k in range(1, n + 1):
            if k in tenis:
                continue
            ys, xs = np.where(rot == k)
            cx = xs.mean()
            if not any(x0 <= cx <= x1 for x0, x1 in caixas):
                removido[ys, xs] = True

    # 1. halo (fora da zona dos tênis), duas passadas
    for _ in range(2):
        vivo = alfa & ~removido
        transp = ~vivo
        vizinho_transp = np.zeros_like(vivo)
        vizinho_escuro = np.zeros_like(vivo)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            vizinho_transp |= np.roll(transp, (dy, dx), (0, 1))
            vizinho_escuro |= np.roll(vivo & (L < 90), (dy, dx), (0, 1))
        halo = vivo & vizinho_transp & vizinho_escuro & (L >= 120) & (sat <= 45) & ~zona
        removido |= halo

    a[removido, 3] = 0
    return a, int(removido.sum())


def limpar(caminho):
    folha = np.array(Image.open(caminho).convert('RGBA'))
    n = folha.shape[1] // QUADRO[0]
    total = []
    for i in range(n):
        q, k = limpar_quadro(folha[:, i * QUADRO[0]:(i + 1) * QUADRO[0]])
        folha[:, i * QUADRO[0]:(i + 1) * QUADRO[0]] = q
        total.append(k)
    Image.fromarray(folha).save(caminho)
    return total


if __name__ == '__main__':
    for nome in ('mariana', 'marcela'):
        p = Path(f'public/assets/personagens/{nome}/{nome}-spritesheet.png')
        print(nome, 'pixels removidos por quadro:', limpar(p))
