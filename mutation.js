const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
    # input type
    input AccountInput {
        name: String
    }

    # search type
    type Account {
        name: String
    }

    type Mutation {
        createAccount(input: AccountInput):Account
        updateAccount(id:ID!, input: AccountInput):Account
    }

    type Query {
        accounts: [Account]
    }
`)

const fakeDb = {}

const root = {
    accounts() {
        return Object.values(fakeDb);
    },
    createAccount({ input }) {
        fakeDb[input.name] = input;
        return fakeDb[input.name];
    },

    updateAccount({ id, input }) {
        const updateAccount = Object.assign({}, fakeDb[id], input);
        fakeDb[id] = updateAccount;
        return updateAccount;
    }
}

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

// 公开文件夹，供用户访问静态资源
app.use(express.static('public'))

app.listen(3000)


/*
 mutation{
   createAccount(input:{
        name:"libaoyue"
   }){
        name
      }
 }

    query{
      accounts{
        name
      }
    }

mutation{
  updateAccount(
    id:"libaoyue",
    input:{
       name:"tom"
    }) { # what we need return
     name
   }
}
*/