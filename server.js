const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
    type Account {
        name: String
        age: Int
        sex: String
        department: String
        salary(city: String): Int
    }
    type Query {
        hello: String
        accounntName: String
        age: Int
        account(username: String): Account
        getClassMates(classNo: Int!): [String]
    }
`)

const root = {
    hello: () => {
        return 'hello world';
    },
    accounntName: () => {
        return 'liby'
    },
    age: () => {
        return 18
    },
    account: ({ username }) => {
        const name = username;
        const sex = 'nv';
        const age = 12;
        const department = '科学院';
        const salary = ({city}) => {
            if (city === 'bj' || city === 'sh' || city === 'gz') {
                return 10000;
            }else{
                return 100;
            }
        }
        return {
            name,
            age,
            sex,
            department,
            salary
        }
    },
    getClassMates({ classNo }) {
        const obj = {
            31: ['zs', 'ls', 'ww'],
            61: ['mark', 'tom', 'nathan']
        }
        return obj[classNo];
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