"""Converte o MIDI da música de fundo numa lista compacta de notas para o sintetizador do jogo (src/services/som.js).

Uso: python3 ferramentas/converter_midi.py references/musica/loccitane-espalhe-amor.mid src/data/musica.js
Sem dependências: lê o formato MIDI direto (tipo 0 ou 1, um andamento só).
Cada nota vira 4 inteiros: início e duração em ticks do MIDI (divisao = ticks por tempo), nota MIDI e intensidade (0-127).
Os tempos ficam exatos: o arquivo foi tocado à mão e quase nenhuma nota cai numa grade.
"""
import struct, sys

def varlen(d, i):
    v = 0
    while True:
        b = d[i]; i += 1; v = (v << 7) | (b & 0x7F)
        if not b & 0x80: return v, i

def ler(caminho):
    d = open(caminho, 'rb').read()
    assert d[:4] == b'MThd'
    _, ntracks, tpb = struct.unpack('>HHH', d[8:14])
    i, tempo, notas = 14, 500000, []
    for _ in range(ntracks):
        assert d[i:i + 4] == b'MTrk'
        fim = i + 8 + struct.unpack('>I', d[i + 4:i + 8])[0]; i += 8
        tick, status, abertas = 0, 0, {}
        while i < fim:
            delta, i = varlen(d, i); tick += delta
            if d[i] & 0x80: status = d[i]; i += 1
            tipo = status & 0xF0
            if status == 0xFF:
                meta = d[i]; tam, j = varlen(d, i + 1)
                if meta == 0x51: tempo = int.from_bytes(d[j:j + 3], 'big')
                i = j + tam
            elif status in (0xF0, 0xF7):
                tam, i = varlen(d, i); i += tam
            elif tipo in (0x80, 0x90):
                nota, vel = d[i], d[i + 1]; i += 2
                if tipo == 0x90 and vel: abertas.setdefault(nota, []).append((tick, vel))
                elif abertas.get(nota): ini, v = abertas[nota].pop(0); notas.append((ini, tick - ini, nota, v))
            elif tipo in (0xC0, 0xD0): i += 1
            else: i += 2
        i = fim
    return tpb, tempo, sorted(notas)

def main(origem, destino):
    tpb, tempo, notas = ler(origem)
    dados = []
    for ini, dur, nota, vel in notas: dados += [ini, max(1, dur), nota, vel]
    fim = max(i + d for i, d, _, _ in notas)
    bpm = round(60_000_000 / tempo, 3)
    with open(destino, 'w') as f:
        f.write('// Música de fundo: "Espalhe Amor" (L’Occitane), convertida de references/musica/loccitane-espalhe-amor.mid\n')
        f.write('// por ferramentas/converter_midi.py. Enviada pelo Pedro em 17/11/2026. Não editar à mão.\n')
        f.write(f'// {len(notas)} notas; tempos em ticks ({tpb} por tempo); cada nota: início, duração, nota MIDI, intensidade.\n')
        f.write(f'export const MUSICA = {{ bpm: {bpm}, divisao: {tpb}, fim: {fim}, notas: [{",".join(map(str, dados))}] }};\n')
    print(f'{len(notas)} notas, {bpm} bpm, {fim / tpb * 60 / bpm:.1f} s')

if __name__ == '__main__':
    main(*sys.argv[1:3])
