56:31

npm init -y
node -v
npm -v
npm install --global yarn
yarn -v

yarn add -D @types/node typescript
yarn add -D ts-node
yarn add -D nodemon
yarn add -D @mikro-orm/cli @mikro-orm/core @mikro-orm/migrations @mikro-orm/postgresql pg

yarn watch
yarn dev

npx mikro-orm migration:create
npx mikro-orm migration:down --to 0

yarn add express apollo-server-express graphql type-graphql
yarn add -D @types/express

yarn add reflect-metadata
yarn add class-validator
