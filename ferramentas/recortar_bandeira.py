"""Recorta a bandeira do jardim da fachada (arte original enviada pelo Pedro) para usar no fim da rua da cidade.

Uso: python3 ferramentas/recortar_bandeira.py references/propostas/fachada-fechada-original.png public/assets/showroom/bandeira-jardim.png
Máscara por cor: o tecido é a maior mancha vermelha contínua (preenchida linha a linha, para incluir o logo e o
texto claros); mastro e base são os pixels cinza-escuros numa faixa estreita. Saída em 3 px por unidade do jogo
(a arte de 1672 px vale 320 unidades), com alfa binário.
"""
import sys
from collections import deque
import numpy as np
from PIL import Image

def recortar(origem, destino):
    im = np.array(Image.open(origem).convert('RGB')).astype(int)
    x0, y0, x1, y1 = 110, 350, 320, 810
    c = im[y0:y1, x0:x1]; R, G, B = c[..., 0], c[..., 1], c[..., 2]; H, W = R.shape
    vermelho = (R > 150) & (G < 110) & (B < 100) & (R - G > 80)
    rotulo = np.zeros((H, W), int); tamanhos = {}; n = 0
    for y in range(H):
        for x in range(W):
            if vermelho[y, x] and not rotulo[y, x]:
                n += 1; fila = deque([(y, x)]); rotulo[y, x] = n; k = 0
                while fila:
                    a, b = fila.popleft(); k += 1
                    for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        u, v = a + da, b + db
                        if 0 <= u < H and 0 <= v < W and vermelho[u, v] and not rotulo[u, v]:
                            rotulo[u, v] = n; fila.append((u, v))
                tamanhos[n] = k
    tecido = rotulo == max(tamanhos, key=tamanhos.get)
    m = np.zeros((H, W), bool)
    for y in range(H):
        xs = np.where(tecido[y])[0]
        if len(xs): m[y, xs.min():xs.max() + 1] = True
    cinza = ((R + G + B) < 190) & (abs(R - G) < 28) & (abs(G - B) < 28)
    for y in range(H):
        yy = y + y0
        for x in range(W):
            xx = x + x0
            if 640 <= yy <= 785 and 161 <= xx <= 169 and cinza[y, x]: m[y, x] = True  # mastro
            if 770 <= yy <= 805 and ((xx - 166) / 48) ** 2 + ((yy - 787) / 16) ** 2 <= 1 and cinza[y, x]: m[y, x] = True  # base
    ys, xs = np.where(m)
    rgba = np.dstack([c, np.where(m, 255, 0)]).astype('uint8')
    img = Image.fromarray(rgba, 'RGBA').crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    f = 3 / (1672 / 320)
    img = img.resize((round(img.width * f), round(img.height * f)), Image.LANCZOS)
    a = np.array(img); a[..., 3] = np.where(a[..., 3] > 127, 255, 0); img = Image.fromarray(a, 'RGBA')
    img.save(destino, optimize=True)
    print(destino, img.size, 'unidades', round(img.width / 3, 1), '×', round(img.height / 3, 1))

if __name__ == '__main__':
    recortar(*sys.argv[1:3])
