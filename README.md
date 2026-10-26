# Gov.pi Cidadão — app (React Native + Expo)

Protótipo navegável do app Gov.pi Cidadão para **Android e iOS**, feito a partir do
`govpi-prototipo-navegavel.html` com a linguagem visual da **Proposta web menu azul (v21.13)**.
Dados simulados (Ana Souza). Nada é enviado a sistemas reais.

- Expo SDK 58 · React Native 0.88 · Expo Router · TypeScript
- Mesma base de código roda em Android, iOS e web

## Como o app abre

O cidadão começa **deslogado, na tela do Assistente Gov.pi** (aba central selecionada):
robô azul, "O que você precisa resolver hoje?", sugestões e o campo com "Fale".
Cada resposta mostra uma barra de progresso e um texto de status por etapa
("Entendendo o seu pedido...", "Consultando o DETRAN-PI...").
Quando o pedido precisa de conta, aparece um cartão de login dentro da conversa; depois de entrar,
o assistente responde "Autenticação realizada com sucesso!" e segue de onde parou.
A Área do cidadão mostra um convite para entrar enquanto a pessoa não tem login.

### Área do cidadão (logado)
Adaptada da versão mobile da web (v21): cabeçalho azul com saldo da Nota Piauiense, avisos, foto,
nível Opala e conquistas; grade de atalhos 4x2 (Meu perfil, Minha jornada, Nota Piauiense, Conversas,
Feed, Zap do Cidadão, Configurações, Ajuda) com selos; campo "O que você precisa resolver?" que leva
ao Assistente; compartilhar conquistas, Zap do Cidadão, Para mim, acompanhamento com etapas, carteiras
(QR e compartilhar) e serviços favoritos. Em Meu perfil a pessoa escolhe a foto de perfil (galeria ou câmera, via expo-image-picker);
em Configurações ajusta privacidade, tamanho do texto e contraste.
Serviços: busca igual à do Início (o robô abre o Assistente) e filtros em chips: Categoria, Detran, Empresas, Servidor e Órgão.
Menu inferior: Início, Assistente Gov.pi, Serviços e Área do cidadão (a Jornada fica nos atalhos).
Tipografia compacta: títulos de seção 16 semi-negrito, corpo e subtítulos 12 normal, botões 12; telas 20, cards 14, legendas 11 (`components/ui.tsx`, componente `T`).
Raios iguais aos da web: 8 px em itens e campos, 10 px em botões, 12 px em blocos e 22 px em folhas.
Ajuda traz o atalho para o Prisma Lab.
Ao concluir uma solicitação, "Finalizar conversa" (no cartão do protocolo ou no X do topo) volta para a tela inicial do assistente.

## Como rodar no celular (sem instalar Android Studio)

1. Instale o Node.js 22.13 ou mais novo (versão LTS em nodejs.org). Confira com `node -v`.
2. Na pasta do projeto:
   ```bash
   npm install
   npx expo start
   ```
3. Instale o app **Expo Go** no celular (Play Store / App Store) e leia o QR Code que aparece no terminal.
   Celular e computador precisam estar na mesma rede Wi-Fi (ou use `npx expo start --tunnel`).

Para abrir no navegador: `npx expo start --web`.

## Gerar o APK (Android) ou build de iOS

Com uma conta gratuita da Expo:
```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build -p android --profile preview   # gera um .apk instalável
npx eas-cli@latest build -p ios                          # exige conta Apple Developer
```

## Estrutura

```
src/
  theme/tokens.ts       cores, fontes, raios, sombras (vindos da proposta web)
  data/catalog.ts       catálogo de serviços e categorias (mesmo da web)
  data/mock.ts          carteira, solicitações, avisos, jornada, conquistas
  state/assistant.ts    assistente simulado (roteiro de respostas)
  state/app-state.tsx   estado do protótipo: login, cenário, conversa, favoritos
  components/
    Robot.tsx           mascote azul do Assistente Gov.pi
    chat-cards.tsx      cartões da conversa (login, resumo, protocolo, serviços)
    hero.tsx            fundo azul com ondas e campo de conversa do Início
    blocks.tsx          cartão de serviço (normal e compacto), Prisma Lab, carteira em pilha, medalhas, solicitação com etapas, cartão de serviço
    TabBar.tsx          abas com rótulo; centro = Assistente Gov.pi
    sheet.tsx           folha inferior (Modal no celular)
    ui.tsx, page.tsx    botões, chips, seções, cabeçalhos, toast
  app/                  telas (Expo Router: cada arquivo é uma rota)
    (tabs)/index        Assistente Gov.pi — tela de entrada (rota "/")
    (tabs)/inicio       Início: busca que abre o Assistente, banners (assets/banners), entrar, mais acessados, Prisma Lab
    (tabs)/jornada, servicos, perfil (Área do cidadão)
    configuracoes, meu-perfil, feed, ajuda, conquistas
    atividade, carteira, avisos, por-que, conversas, compartilhar
    entrar, cadastro, recuperar-senha
    whatsapp, continua-no-app, continua-no-whats, faltam-dados, erro
```

## Como a web virou app

| Na web | No app |
|---|---|
| Menu azul + hambúrguer | Barra de abas embaixo (**Assistente Gov.pi**, Jornada, Serviços, Perfil) |
| Hero azul com ondas e campo branco | Igual, com SVG + degradê; ao rolar vira barra fixa com "O que você precisa resolver?" |
| Chips translúcidos (`backdrop-filter`) | Branco semitransparente (não há desfoque confiável no Android) |
| Conversa em folha inferior | Aba central "Assistente Gov.pi", tela de entrada do app |
| Carteira em pilha | Pilha animada; toque traz o cartão à frente; QR e PDF pedem biometria |
| Medalhas com `clip-path` | Formas em SVG (círculo, quadrado, hexágono) |
| Hover | Estado de toque pressionado e vibração leve |
| Rodapé, faixa "baixe o app", QR das lojas | Removidos (não fazem sentido dentro do app) |

Detalhes de Android já atendidos: áreas de toque de 48dp, botão voltar fecha folhas e modais,
rótulos de acessibilidade em todos os botões (TalkBack), tela de ponta a ponta com áreas seguras.

## Modo protótipo

Em **Perfil > Modo protótipo** dá para trocar o estado da conta (Com histórico, Conta nova, Após concluir)
e abrir as telas de fluxo que não aparecem no caminho principal (WhatsApp, erro, dados faltantes).

## Próximos passos sugeridos

- Tema escuro (os tokens da web já existem; falta ligar)
- Integração real: login gov.br/ID Piauí, API do assistente, biometria (`expo-local-authentication`)
- Notificações push (`expo-notifications`) e widget do campo de conversa na tela inicial do Android

## Prévia web num único arquivo

```bash
npx expo export --platform web --output-dir dist
python3 tools/build-preview.py dist previa.html
```
