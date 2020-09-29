const express = require('express')
const port = 3001
const { graphqlHTTP } = require('express-graphql');
const fetch = require('node-fetch')
var { buildSchema} = require('graphql');
var baseUrl = "http://localhost:3000"


// Initialize a GraphQL schema
var schema = buildSchema(`
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type User {
    id: ID
    name: String!
    email: String!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String!): User
    deleteUser(id: ID!): User
  }

`);

// Root resolver
var root = {
  users() {
    //fetch is a request library using promises
    console.log(`Running query to get all users...`)
    return fetch(`${baseUrl}/users`).then((res) => {return res.json()})
  },
  user(obj) {
    console.log(`Running query to get user with ID = ${obj.id}`)
    return fetch(`${baseUrl}/users/${obj.id}`)
      .then((res) => {
        return res.json() //promoise
      }).then((json) => { //parse through promise 
        console.log(`Received user = ${JSON.stringify(json)}`)
        return json[0] 
      })
  },
  async createUser(userPayload) {
    console.log(`Insert into table with data = ${JSON.stringify(userPayload)}`);

    const options = {
      method: 'POST',
      body: JSON.stringify(userPayload),
      headers: {
          'Content-Type': 'application/json'
      }
    }

    return fetch(`${baseUrl}/users`, options)
    .then(res => res.json())
    .then(async res => {
      if (res.success) {
        const usersArray = await this.users();  // fetch latest array
        return usersArray[usersArray.length - 1];   // return last added entry on success
      } else {
        return 0;
      }
    });
  }

  await deleteUser(userPayload) {
    console.log(`Delete data from table = ${JSON.stringify(userPayload)}`);
    const options = {
      method: 'DELETE',
      body: JSON.stringify(userPayload), //converts a JavaScript object or value to a JSON string
    
    }

  }








}

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed k.in browser
}));


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
