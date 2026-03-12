# Como Publicar este App na Google Play Store

Você perguntou "Como pôr este HTML na Google Play". A Google Play Store não aceita arquivos HTML ou sites diretamente. Ela aceita aplicativos Android (`.aab` ou `.apk`).

Para transformar o seu código Web (HTML/React) num aplicativo Android, a melhor ferramenta atual é o **Capacitor**.

## Passo 1: Preparar o Projeto

Este código foi convertido para **React** para ser moderno e aceito mais facilmente.

1. Instale o Node.js no seu computador.
2. Abra o terminal na pasta onde guardou estes ficheiros.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Construa o projeto web:
   ```bash
   npm run build
   ```
   *Isto criará uma pasta `dist` ou `build` com o seu HTML otimizado.*

## Passo 2: Transformar em Android (com Capacitor)

1. Instale o Capacitor:
   ```bash
   npm install @capacitor/core
   npm install -D @capacitor/cli
   ```

2. Inicialize o Capacitor:
   ```bash
   npx cap init
   ```
   *Responda às perguntas:*
   *   **Name:** Gestor Financeiro
   *   **Package ID:** com.seu-nome.gestorfinanceiro (Isto deve ser único na Play Store!)
   *   **Web Asset Dir:** `dist` (ou a pasta criada no passo 1)

3. Instale a plataforma Android:
   ```bash
   npm install @capacitor/android
   npx cap add android
   ```

4. Sincronize o código:
   ```bash
   npx cap sync
   ```

## Passo 3: Gerar o App na Android Studio

1. Abra o projeto no Android Studio:
   ```bash
   npx cap open android
   ```

2. No Android Studio:
   *   Aguarde a indexação (Gradle sync).
   *   Pode testar o app ligando o seu telemóvel Android ao PC e clicando no botão "Play" (Run).

3. Criar o ficheiro para a Google Play (Signed Bundle):
   *   Vá ao menu **Build** -> **Generate Signed Bundle / APK**.
   *   Escolha **Android App Bundle**.
   *   Crie uma "Key Store" (uma senha para o seu app). **Não perca este ficheiro nem a senha!** Sem eles, nunca mais poderá atualizar o app.
   *   O Android Studio irá gerar um ficheiro `.aab`.

## Passo 4: Google Play Console

1. Crie uma conta de desenvolvedor na [Google Play Console](https://play.google.com/console) (custa $25 USD, pago uma única vez).
2. Clique em **Criar App**.
3. Preencha os detalhes (Nome, Descrição, Ícone, Screenshots).
4. Na secção de **Produção** (Production), faça upload do ficheiro `.aab` que gerou no Passo 3.
5. Preencha a classificação de conteúdo e política de privacidade.
6. Envie para revisão.

---

### Se quiser usar o seu ficheiro HTML original (Sem React)

Se prefere não usar este código React e quer apenas o seu ficheiro HTML original:

1. Crie uma estrutura de pastas vazia.
2. Coloque o seu `index.html` numa pasta chamada `www`.
3. Siga o **Passo 2** acima, mas na pergunta "Web Asset Dir", escreva `www`.
4. O resto do processo é idêntico.