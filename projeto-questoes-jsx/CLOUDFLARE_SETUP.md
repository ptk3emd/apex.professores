# Setup Cloudflare Pages

## Configuração Necessária

Este projeto foi configurado para funcionar com **Cloudflare Pages**.

## Problemas Identificados e Resolvidos

### ❌ Problema Original
- **JSX carregado diretamente no HTML** sem transpilation
- Navegador não consegue interpretar JSX nativamente
- React carregado via CDN, mas componentes não eram compilados

### ✅ Solução Implementada

1. **Configurado Vite** para build e transpilation de JSX
2. **Criado `wrangler.toml`** para Cloudflare Pages
3. **Atualizado `package.json`** com dependências corretas
4. **Criado `src/main.jsx`** como entry point React
5. **Modificado `index.html`** para carregar o bundle do Vite

## Como Fazer Deploy no Cloudflare Pages

### 1. Instalar dependências
```bash
npm install
```

### 2. Build local (teste)
```bash
npm run build
```

### 3. Fazer deploy no Cloudflare Pages

#### Opção A: Via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy dist
```

#### Opção B: Conectar repositório ao GitHub
1. Push para GitHub: `git push -u origin main`
2. Acesse dashboard.cloudflare.com
3. Pages > Create application > Connect to Git
4. Selecione este repositório
5. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`

## Configurar `wrangler.toml`

Complete o arquivo `wrangler.toml` com suas credenciais:

```toml
account_id = "seu_cloudflare_account_id"
zone_id = "seu_cloudflare_zone_id"
route = "seu_dominio.com"
```

Para obter esses valores:
- Acesse https://dash.cloudflare.com/
- Vá até "Pages" > "Workers"
- Copie seu Account ID do sidebar

## Estrutura do Projeto

```
projeto-questoes-jsx/
├── src/
│   ├── main.jsx          ← Entry point React (novo)
│   ├── components/       ← Componentes JSX
│   ├── scripts/          ← JavaScript utilities
│   ├── styles/           ← CSS
│   └── images/           ← Assets
├── index.html            ← Template HTML (atualizado)
├── package.json          ← Dependencies (atualizado)
├── vite.config.js        ← Vite config (novo)
├── wrangler.toml         ← Cloudflare Pages config (novo)
└── .gitignore            ← Git ignore (novo)
```

## Desenvolvimento Local

```bash
npm run dev
```

Acessar: `http://localhost:5173`

## Troubleshooting

Se o site ainda não aparecer na URL do Cloudflare:

1. Verifique se o build completou sem erros: `npm run build`
2. Confirme que `dist/index.html` foi gerado
3. Tente fazer deploy novamente: `wrangler pages deploy dist`
4. Verifique os logs no dashboard do Cloudflare
