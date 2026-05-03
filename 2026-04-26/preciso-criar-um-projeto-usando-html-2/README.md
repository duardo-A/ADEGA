# Wild Group BR

Site institucional da Wild Group BR, empresa de criacao de sites, aplicativos,
sistemas e solucoes digitais para comercios.

## Estrutura

```text
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
│   ├── banner-wild-group.png
│   ├── wildgroup-br.png
│   └── .gitkeep
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── .editorconfig
└── README.md
```

## Como abrir no VS Code

1. Abra o VS Code.
2. Clique em `File > Open Folder`.
3. Selecione esta pasta do projeto.
4. Abra o arquivo `index.html`.
5. Clique com o botao direito e escolha `Open with Live Server`, se tiver a extensao instalada.

Tambem e possivel abrir o `index.html` diretamente no navegador.

## Onde editar

- `index.html`: textos, secoes, links e conteudo da pagina.
- `css/styles.css`: visual, cores, espacamentos, responsividade e identidade.
- `js/app.js`: menu mobile, ano automatico e validacao do formulario.
- `assets/`: logo, banner, imagens e outros arquivos do projeto.

## Formulario

O formulario usa Netlify Forms. Depois de publicar ou republicar o site na
Netlify, acesse:

`Project configuration > Notifications > Emails and webhooks > Form submission notifications`

Crie uma notificacao para o formulario `contact` enviando para
`wildgroup.br@gmail.com`.
