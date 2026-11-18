# Mariana e Marcela

Mariana: prancha de poses aprovada no chat, preservada integralmente em mariana-poses-aprovadas.png. Marcela: a folha original exibida no chat não ficou disponível no workspace; marcela-poses-exportacao.png é uma nova exportação gerada com aquela folha como referência, preservando roupa, corte de cabelo, tênis claros, pulseira e relógio. A versão runtime precisa de revisão visual do usuário.

Derivados em public/assets/personagens: fundo removido, alfa binário, células110×180, pés na base; Mariana7 quadros (o banco da oitava pose não vai ao runtime), Marcela12. São poses para animação simples de NPC, não caminhada. Fontes e personagens anteriores preservados. Usuário autorizou as artes das pessoas das fotos para o jogo.

## Limpeza localizada das folhas (18/11/2026)

Depois de `ferramentas/preparar_convidadas.py`, as folhas passaram por `ferramentas/limpar_convidadas.py`, que só torna pixels transparentes em três regiões: halo claro e pouco saturado colado ao contorno escuro; vão estreito de cinza/branco entre as pernas (Marcela), do quadril até os tênis; e fundo/sombra bege entre os tênis (Mariana). Pele, rostos, cadarços e tênis ficam intactos e a altura visível de todos os quadros continua 170 px. Não foi usado preenchimento global de buracos. Para regenerar: rodar o preparo e, em seguida, a limpeza.
