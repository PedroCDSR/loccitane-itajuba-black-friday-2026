from PIL import Image
import numpy as np
from scipy import ndimage
from pathlib import Path

def sprite(im):
 a=np.array(im.convert('RGBA')); rgb=a[:,:,:3].astype(int)
 # Isola o personagem e remove fundo claro, molduras e resíduos da prancha.
 # Recorta o fundo claro inclusive nas aberturas entre braços e corpo.
 # Não preencher todos os buracos: isso recolocava a mancha atrás dos braços.
 claro=(rgb.min(2)>150)&(rgb[:,:,0]>175)&(rgb[:,:,1]>170)&((rgb[:,:,0]-rgb[:,:,1])<36)&((rgb[:,:,1]-rgb[:,:,2])<42)
 labels,n=ndimage.label(claro)
 remover=np.zeros(claro.shape,dtype=bool)
 borda=set(np.concatenate([labels[0],labels[-1],labels[:,0],labels[:,-1]]))-{0}
 for k in range(1,n+1):
  yy,xx=np.where(labels==k)
  if k in borda or (len(yy)>80 and yy.mean()<a.shape[0]*.82): remover[yy,xx]=True
 corpo=~remover
 labels,n=ndimage.label(corpo)
 sizes=np.bincount(labels.ravel());sizes[0]=0
 corpo=labels==sizes.argmax()
 a[:,:,3]=np.where(corpo,255,0)
 out=Image.fromarray(a);out=out.crop(out.getbbox())
 out=out.resize((round(out.width*170/out.height),170),Image.Resampling.NEAREST)
 frame=Image.new('RGBA',(110,180));frame.alpha_composite(out,((110-out.width)//2,180-out.height))
 return frame

for nome,path,cols,rows,count in [('mariana','references/personagens/mariana-poses-aprovadas.png',4,2,7),('marcela','references/personagens/marcela-poses-exportacao.png',4,3,12)]:
 im=Image.open(path);w,h=im.size;frames=[]
 for i in range(count):
  col,row=i%cols,i//cols
  if nome=='mariana':box=(col*384+35,65 if row==0 else 540,(col+1)*384-25,480 if row==0 else 952)
  else:box=(round(col*w/cols)+8,round(row*h/rows)+3,round((col+1)*w/cols)-8,round((row+1)*h/rows)-8)
  frames.append(sprite(im.crop(box)))
 sheet=Image.new('RGBA',(110*count,180))
 for i,f in enumerate(frames):sheet.alpha_composite(f,(110*i,0))
 sheet.save(f'public/assets/personagens/{nome}/{nome}-spritesheet.png')
