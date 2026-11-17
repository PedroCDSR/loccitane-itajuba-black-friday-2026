"""Prepara as logos ORIGINAIS da L’Occitane para a tendinha do jogo (escala de 3 px por unidade do mundo).

Uso: python3 ferramentas/preparar_logos.py
Fontes (não alteradas): public/assets/showroom/logo em alta resolução.png e SELO_REVENDEDOR.pdf.png.
- logo-tenda.png: marca branca sobre o vermelho da própria logo, recortada em volta da marca e reduzida sem
  deformar; duas cores (vermelho e branco), como pixel art.
- selo-tenda.png: o selo de revendedor com as cores invertidas a pedido do usuário: disco vermelho e arte branca
  (anel de texto, árvore). Fora do disco, transparente.
"""
import numpy as np
from PIL import Image

BASE = 'public/assets/showroom/'

def logo(largura_px=168, margem=0.06):
    im = np.array(Image.open(BASE + 'logo em alta resolução.png').convert('RGB')).astype(int)
    branco = im.min(axis=2) > 200
    ys, xs = np.where(branco)
    vermelho = tuple(int(v) for v in np.median(im[~branco], axis=0))
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    m = int((x1 - x0) * margem)
    recorte = Image.fromarray(im[max(0, y0 - m):y1 + m, max(0, x0 - m):x1 + m].astype('uint8'))
    altura = round(largura_px * recorte.height / recorte.width)
    peq = np.array(recorte.resize((largura_px, altura), Image.LANCZOS).convert('L'))
    saida = np.zeros((altura, largura_px, 3), 'uint8'); saida[:] = vermelho; saida[peq > 150] = (255, 255, 255)
    Image.fromarray(saida).save(BASE + 'logo-tenda.png', optimize=True)
    print('logo-tenda.png', largura_px, altura, 'vermelho', vermelho)
    return vermelho

def selo(vermelho, diametro_px=72):
    im = np.array(Image.open(BASE + 'SELO_REVENDEDOR.pdf.png').convert('RGB')).astype(int)
    R, G, B = im[..., 0], im[..., 1], im[..., 2]
    arte = (R - G > 60) & (R - B > 40)  # partes vermelhas do selo original
    ys, xs = np.where(arte)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    raio = max(xs.max() - xs.min(), ys.max() - ys.min()) / 2 * 1.04
    x0, y0 = int(cx - raio), int(cy - raio); lado = int(2 * raio)
    mascara = Image.fromarray((arte[y0:y0 + lado, x0:x0 + lado] * 255).astype('uint8')).resize((diametro_px, diametro_px), Image.LANCZOS)
    a = np.array(mascara) > 110
    yy, xx = np.mgrid[0:diametro_px, 0:diametro_px]; c = (diametro_px - 1) / 2
    disco = (xx - c) ** 2 + (yy - c) ** 2 <= (diametro_px / 2) ** 2
    saida = np.zeros((diametro_px, diametro_px, 4), 'uint8')
    saida[disco] = (*vermelho, 255); saida[disco & a] = (255, 255, 255, 255)
    Image.fromarray(saida, 'RGBA').save(BASE + 'selo-tenda.png', optimize=True)
    print('selo-tenda.png', diametro_px)

if __name__ == '__main__':
    selo(logo())
