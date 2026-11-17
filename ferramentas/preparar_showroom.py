# Gera os derivados do showroom em public/assets/showroom/ a partir das artes originais (que ficam intactas).
# Uso: python3 ferramentas/preparar_showroom.py . public/assets/showroom
# - fachada.png / interior.png: conceitos sem a exploradora desenhada, reduzidos a 960x540 (320x180 no mundo, zoom 3)
# - caju.png / roma.png: versões na escala do jogo (3 pixels de textura por unidade do mundo)
# - pedro-jogo.webp/.json e pedro-intro.webp: folha do Pedro em metade da resolução e quadro parado da intro
import sys
from PIL import Image, ImageOps
R,OUT=sys.argv[1],sys.argv[2]
def abrir(n): return Image.open(R+'/references/propostas/'+n).convert('RGB')
# ---------- interior: retira a exploradora desenhada ----------
a=abrir('showroom-interior-exploradora-andando.png'); o=a.copy()
def cp(src,dst): a.paste(o.crop(src),dst)
def tile(src,box,espelhar=False):
    t=o.crop(src);w,h=t.size;i=0
    for x in range(box[0],box[2],w):
        tt=ImageOps.mirror(t) if (espelhar and i%2) else t;i+=1
        for y in range(box[1],box[3],h):
            a.paste(tt.crop((0,0,min(w,box[2]-x),min(h,box[3]-y))),(x,y))
tile((680,648,738,750),(548,428,680,757),True)      # parede de madeira atrás dela
tile((680,648,738,750),(672,606,704,646))
cp((700,517,732,541),(672,517))                      # pontas das duas prateleiras pequenas
cp((730,619,762,641),(672,619))
post=(511,515,551,600)                               # montante de pinho
cp(post,(511,428));cp(post,(511,628));cp((511,515,551,572),(511,713))
a.paste(ImageOps.mirror(o.crop((227,773,472,838))),(472,773))   # piso: espelho do trecho limpo à esquerda
cp((717,773,745,838),(717,773))                      # devolve o começo do tapete
tile((440,752,510,773),(551,752,742,773))            # base da estante
cp((455,752,497,773),(469,752))
# ---------- fachada: retira a exploradora da porta ----------
b=abrir('showroom-pixel-art-moderno.png'); p=b.load(); ob=b.copy(); q=ob.load()
X0,X1=646,739
from PIL import ImageFilter
fundo=ob.copy(); f=fundo.load(); m=Image.new('L',b.size,0); mm=m.load()
for y in range(520,748):
    l=[sum(q[x,y][k] for x in range(640,646))/6 for k in range(3)]
    r=[sum(q[x,y][k] for x in range(735,739))/4 for k in range(3)]
    for x in range(X0,X1-3):
        t=(x-X0)/(X1-3-X0)
        ruido=((x*7+y*13)%5-2)*1.5 if ((x//3+y//3)%2) else 0
        c=tuple(int(max(0,min(255,l[k]*(1-t)+r[k]*t+ruido))) for k in range(3))
        f[x,y]=c
        if sum(abs(c[k]-q[x,y][k]) for k in range(3))>60: mm[x,y]=255
m=m.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.2))
b.paste(fundo,(0,0),m)
b.paste(ob.crop((752,745,838,816)),(646,745))
# ---------- saída ----------
def fundo_jogo(im,nome):
    im.resize((960,540),Image.LANCZOS).quantize(255,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(OUT+'/'+nome,optimize=True)
fundo_jogo(b,'fachada.png'); fundo_jogo(a,'interior.png')
def sprite(origem,nome,altura):
    im=Image.open(R+'/public/assets/'+origem).convert('RGBA'); im=im.crop(im.getbbox())
    w=round(im.width*altura/im.height)
    im=im.resize((w,altura),Image.LANCZOS)
    r,g,bb,al=im.split(); al=al.point(lambda v:255 if v>110 else 0)   # borda nítida, sem halo
    Image.merge('RGBA',(r,g,bb,al)).save(OUT+'/'+nome,optimize=True); print(nome,w,altura)
sprite('produtos/caju-sabonete-pixel-art.png','caju.png',78)
sprite('produtos/roma-chantilly-pixel-art.png','roma.png',78)

# ---------- Pedro: folha do jogo em metade da resolução e quadro da intro ----------
# (a folha original e o atlas ficam em public/assets/personagens/, sem alteração)
import json
P = R + '/public/assets/personagens/'
atlas = json.load(open(P + 'pedro-atlas.json')); folha = Image.open(P + 'pedro-spritesheet.png').convert('RGBA')
F = 0.5
W, H = round(folha.width * F), round(folha.height * F)
folha.resize((W, H), Image.LANCZOS).save(OUT + '/pedro-jogo.webp', lossless=True, method=6)
esc = lambda d: {k: round(v * F) for k, v in d.items()}
novo = {'frames': {}, 'meta': dict(atlas['meta'], image='pedro-jogo.webp', size={'w': W, 'h': H}, scale=str(F),
        note='Derivado de pedro-spritesheet.png em metade da resolução, gerado por ferramentas/preparar_showroom.py.')}
for n, f in atlas['frames'].items():
    novo['frames'][n] = dict(f, frame=esc(f['frame']), spriteSourceSize=esc(f['spriteSourceSize']), sourceSize=esc(f['sourceSize']))
json.dump(novo, open(OUT + '/pedro-jogo.json', 'w'), ensure_ascii=False, indent=1)
fr = atlas['frames']['parado-0']['frame']
q = folha.crop((fr['x'], fr['y'], fr['x'] + fr['w'], fr['y'] + fr['h']))
q.resize((round(q.width * 185 / q.height), 185), Image.LANCZOS).save(OUT + '/pedro-intro.webp', lossless=True, method=6)
