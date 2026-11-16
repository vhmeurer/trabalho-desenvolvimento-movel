# Gestor de Hábitos

Aplicativo mobile para criar hábitos, marcar o que foi feito a cada dia e acompanhar a constância ao longo do tempo. Cada hábito aparece como uma **corrente de dias**: um elo para cada dia, que fica fechado quando o hábito é feito e se rompe quando um dia agendado passa em branco.

Trabalho da disciplina de Desenvolvimento Mobile, feito com Expo (React Native), Firebase e APIs públicas de frases e tradução.

## Funcionalidades

- **Conta de usuário**: cadastro, login, logout e recuperação de senha por e-mail (Firebase Authentication).
- **Validação de formulários**: e-mail válido, nome obrigatório e senha forte com checklist ao vivo (8+ caracteres, maiúscula, minúscula, número e caractere especial).
- **Hábitos**: criar, editar e excluir hábitos com nome, descrição, categoria, ícone, cor, meta, frequência (todos os dias ou dias da semana escolhidos) e horário de lembrete. O formulário mostra uma prévia do card enquanto é preenchido.
- **Tela Hoje**: lista os hábitos agendados para o dia, separados em "Para fazer" e "Feitos", com um painel de progresso do dia e opção de desfazer a última marcação.
- **Corrente de 7 dias** em cada card e **histórico de 4 semanas** na tela de detalhes, com sequência atual, recorde e taxa de conclusão dos últimos 30 dias.
- **Busca e filtro** de hábitos por nome e categoria.
- **Estatísticas**: conclusão por dia ou por semana (gráfico de barras), check-ins por categoria (gráfico de rosca) e ranking de desempenho por hábito.
- **Frase do dia**: uma frase motivacional buscada de uma API externa, traduzida para português e guardada no aparelho até o dia seguinte.
- **Perfil**: nome, e-mail, resumo (hábitos, check-ins e recorde) e edição do nome.
- **Modo escuro**: acompanha a configuração do sistema.
- **Hábitos de exemplo**: um botão nas telas vazias carrega hábitos prontos com histórico, para testar o app sem começar do zero.

> O horário de lembrete fica salvo no hábito, mas o app ainda não dispara notificações.

## Tecnologias

| Área | Ferramenta |
| --- | --- |
| Framework | [Expo SDK 58](https://docs.expo.dev/) com React Native 0.88 e TypeScript |
| Navegação | [Expo Router](https://docs.expo.dev/router/introduction/) (rotas por arquivo, abas e rotas protegidas) |
| Interface | [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3) e fonte [Sora](https://fonts.google.com/specimen/Sora) |
| Gráficos | [react-native-gifted-charts](https://gifted-charts.web.app/) |
| Autenticação | Firebase Authentication (e-mail e senha) |
| Banco de dados | Cloud Firestore |
| Armazenamento local | AsyncStorage (sessão de login e cache da frase do dia) |

## Serviços web externos

| Serviço | Uso |
| --- | --- |
| [ZenQuotes](https://zenquotes.io/) | Frase do dia no Android e iOS |
| [DummyJSON](https://dummyjson.com/docs/quotes) | Frase do dia na versão web, porque a ZenQuotes bloqueia requisições do navegador (CORS) |
| [MyMemory](https://mymemory.translated.net/doc/spec.php) | Tradução da frase do inglês para o português |

Se a tradução falhar, o app mostra a frase original em inglês. O botão "Ver original" alterna entre a tradução e o texto original.

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou mais recente
- Um projeto no [Firebase](https://console.firebase.google.com/)
- Para testar no celular: o app [Expo Go](https://expo.dev/go) instalado (Android ou iOS)

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o Firebase

1. No [console do Firebase](https://console.firebase.google.com/), crie um projeto e adicione um **app Web** (ícone `</>`).
2. Em **Authentication → Método de login**, ative **E-mail/senha**.
3. Em **Firestore Database**, crie o banco de dados.
4. Em **Firestore → Regras**, cole o conteúdo do arquivo [`firestore.rules`](firestore.rules) e publique. Essas regras garantem que cada usuário só lê e escreve os próprios dados.
5. Copie o arquivo de exemplo e preencha com os dados do app Web (em **Configurações do projeto → Seus apps**):

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

### 3. Iniciar o app

```bash
npx expo start
```

No terminal aparece um QR code e um menu:

- **Celular**: abra o Expo Go e leia o QR code (no iOS, use a câmera). O celular e o computador precisam estar na mesma rede.
- **Navegador**: pressione `w`.
- **Emulador Android**: pressione `a` (precisa do Android Studio instalado).

## Como usar

1. **Crie uma conta** na tela inicial, com nome, e-mail e uma senha que cumpra todos os requisitos da lista.
2. Na aba **Hoje**, toque em **Novo hábito**, preencha o formulário e salve. Para testar rápido, use **Carregar hábitos de exemplo** na aba Hábitos.
3. Toque no **círculo à direita** de um hábito para marcá-lo como feito hoje. O painel do topo e a corrente do card são atualizados na hora. Para desfazer, use o botão **Desfazer** da mensagem que aparece embaixo.
4. Toque em um card para abrir os **detalhes**: sequência, recorde, histórico de 4 semanas, e os botões **Editar** e **Excluir**.
5. Na aba **Hábitos**, busque pelo nome ou filtre por categoria.
6. Na aba **Estatísticas**, alterne entre **7 dias** e **4 semanas**.
7. Na aba **Perfil**, edite seu nome ou saia da conta.

### Como ler a corrente

| Elo | Significado |
| --- | --- |
| Círculo cheio | Hábito feito naquele dia |
| Anel vazio | Dia agendado que passou sem o hábito; a corrente se rompe |
| Anel tracejado | Hoje, ainda pendente |
| Ponto pequeno | Dia em que o hábito não estava agendado; não quebra a corrente |

A **sequência** conta os dias agendados seguidos em que o hábito foi feito, ignorando os dias livres. Se o hábito de hoje ainda está pendente, a sequência de ontem continua valendo até o fim do dia.

## Estrutura do projeto

```
src/
├── app/                     Telas (cada arquivo é uma rota do Expo Router)
│   ├── (tabs)/              Abas: Hoje, Hábitos, Estatísticas e Perfil
│   ├── habito/              Novo hábito, detalhes e edição
│   ├── perfil/editar.tsx    Edição do perfil
│   ├── login.tsx
│   └── registro.tsx
├── components/              Componentes reutilizáveis (card, corrente, formulário...)
├── constants/               Tema (cores e fontes), categorias, cores e ícones dos hábitos
├── context/                 Estado global: autenticação, perfil, hábitos e preferências
├── hooks/                   Frase do dia e carga de hábitos de exemplo
├── services/                Firebase, API de frases e mensagens de erro de login
├── data/                    Hábitos de exemplo
├── types/                   Tipos TypeScript
└── utils/                   Datas, estatísticas, validação e navegação
```

## Dados no Firestore

```
users/{uid}                  { name }
users/{uid}/habits/{id}      { name, description, category, icon, color, frequency,
                               weekDays, goal, reminderTime, createdAt, completions }
```

`completions` é a lista de datas (`AAAA-MM-DD`) em que o hábito foi feito. Sequência, recorde, taxas e gráficos são calculados a partir dela, em [`src/utils/habit-stats.ts`](src/utils/habit-stats.ts).

## Comandos úteis

```bash
npx expo start        # inicia o servidor de desenvolvimento
npx expo lint         # verifica o código com o ESLint
npx tsc --noEmit      # verifica os tipos do TypeScript
```

## Equipe

- João Victor Campos
- Victor Hugo Meurer
