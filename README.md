## Criação do projeto

1. Rodar script de criação de pacote: `npm init -y`
2. Instalar dependências de desenvolvimento para utilização do typescript:

   - `npm install typescript -D`
   - `npm install tsx -D` ➡️ rodar a aplicação no node com ts
   - `npm install tsup -D` ➡️ serve para fazer o build da aplicação de ts para js
   - `npx tsc --init` ➡️ inicializar as configurações do ts
   - Normalmente, costumo alterar o target do tsconfig para 2020
   - Para trabalhar com typescript no node, instala-se também os tipos das bibliotecas nativas do nodejs com `npm install @types/node -D`

3. Instalar o eslint para trabalhar com um único estilo de código dentro do repositório. É possível fazer isso de forma manual ou automática
   - De forma automática, rodamos: `npm init @eslint/config` e em seguida respondemos as perguntas sobre o estilo de código que queremos
   - Na forma manual, rodamos `npm install eslint -D` para instalar o eslint como dependência de desenvolvimento no projeto. Em seguida, cria-se o arquivo de configuração do eslint e especifica-se as regras que devem ser aplicadas ao código. Para esta api, utilizarei a configuração automática.
   - Criar arquivo `.eslintignore` e colocar as pastas `node_modules` e `build` dentro dele.

## Início do desenvolvimento das entidades da aplicação

- DRY - Don't repeat yourself
- Não permita alterações diretas nas propriedades das classes (boa prática), somente campos mutáveis devem ter métodos que alteram seu valor de acordo com a regra de negócio definida
- Cria-se os métodos set de acordo com a necessidade, deixando todas as variáveis, num primeiro momento, como private.

## TDD

![image](https://marsner.com/wp-content/uploads/test-driven-development-TDD.png)

## Primeiro teste unitário

1. Configurando o Vitest:
   - `npm install vitest -D`
   - `npm i -D @faker-js/faker`
2. Criando os scripts de teste:
   - `"test": "vitest run --dir src/tests/use-cases"`
   - `"test:watch": "vitest --dir src/tests/use-cases"`
3. Existem duas abordagens na construção de testes unitários para a sua aplicação
   - A primeira abordagem consiste em criar _`InMemoryDatabaseRepositories`_ para lidar com os testes
   - A segunda consiste em fazer um _`mock`_ dos repositórios para testar os casos de uso.
   - Neste treinamento, vamos optar pelo _`mock`_ do repositório instalando o pacote `vitest-mock-extended`.
   - Comando para verificar a cobertura dos testes: `"test:coverage": "vitest --coverage"`

## Adicionando a camada de dados da aplicação

1. Utilizaremos um ORM chamado `Prisma`, bastante conhecido no mundo do _nodejs_ devido à sua performance e integração fantástica com o Typescript. Para isso, instalaremos o pacote com `npm install prisma`
2. No link abaixo está a documentação do prisma sobre como iniciar o setup de acordo com os diferentes banco de dados que você está trabalhando. Aqui utilizaremos o SQL Server.

   - https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-sqlserver

   - Então, iniciamos da seguinte forma: `npx prisma init --datasource-provider sqlserver`. O comando criará uma pasta chamada `prisma` na raíz do projeto contendo um arquivo `schema.prisma`, que será utilizado na criação das tabelas da aplicação.

   - Recomenda-se que você tenha a extensão do VS Code `Prisma` instalada, bem como a seguinte configuração no seu `settings.json`
   - `"[prisma]": { "editor.formatOnSave": true, "editor.defaultFormatter": "Prisma.prisma" }`

3. Define-se os modelos das entidades/tabelas dos bancos de dados e faz-se a migração com o comando `npx prisma migrate dev`

## Início do desenvolvimento da API

1. Para este treinamento iremos utilizar o pacote `fastify` em detrimento do famoso `express`. A principal motivação para tal decisão é o fato de o express ter atingido seu estado máximo de desenvolvimento, enquanto o `fastify` é mantido de forma mais ativa, com melhor suporte e uma melhora considerável na performance.
   Assim: `npm install fastify`

2. Para começar a configuração da API, precisamos também configurar as variáveis de ambiente da nossa aplicação. Para isso, precisaremos instalar duas bibliotecas amplamente utilizadas pela comunidade:

   - `npm install dotenv` ➡️ identificação das variáveis de ambiente
   - `npm install zod`. ➡️ validação dos tipos

3. Para rodar a aplicação, precisaremos de alguns scripts dentro do nosso arquivo `package.json`. Incialmente, vamos contruir 3 scripts:
   - `"dev": "tsx watch src/server.ts"` ➡️ roda nossa aplicação como typescript e em modo "watch", esperando por atualizações para reiniciar e aplicá-las automaticamente.
   - `"build": "tsup src --out-dir build"` ➡️ responsável pela transformação da aplicação ts em js para o processo de deploy
   - `"start": "build/server.js"` ➡️ responsável pelo início da aplicação definitiva js (production ready version)

## Primeiro use-case

![image](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*0R0r00uF1RyRFxkxo3HVDg.png)

## Primeiro teste e2e

1. Para realizarmos testes e2e sem precisar iniciar nossa aplicação, utilizamos o pacote `supertest`

   - `npm install supertest -D`
   - `npm install @types/supertest -D`

2. Para não utilizarmos o banco populado para testes, criaremos um ambiente de testes separado que, para cada teste, irá gerar um banco de dados diferente para rodarmos nossos testes e2e de forma independente. Por isso, criamos o pacote _`vitest-environment-prisma`_ dentro da nossa pasta do prisma. Precisaremos instalar o pacote abaixo para rodar os scripts de criação e exclusão do banco de dados e link da aplicação a cada teste e2e.
   - `npm install npm-run-all -D`

Além disso, rodamos `npm init -y` dentro da pasta criada acima e criamos um arquivo chamado `prisma-test-environment.ts`. Devemos colocar esse arquivo como ponto de entrada no package.json criado (dentro da propriedade main). Dentro deste arquivo, colocaremos o código responsável pela criação de um novo ambiente a cada teste e2e.
Faremos, então o link dele com a nossa aplicação por meio de dois scripts que vão rodar outros dois scripts utilizando o pacote `npm-run-all`

- `"test:create-prisma-environment": "npm link ./prisma/vitest-environment-prisma"`
- `"test:install-prisma-environment": "npm link vitest-environment-prisma"`
- `"pretest:e2e": "run-s test:create-prisma-environment test:install-prisma-environment"`
- `"test:e2e": "vitest run --dir src/tests/http"`
