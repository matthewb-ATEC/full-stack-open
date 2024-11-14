# Part 13

In the previous sections of the course we used MongoDB for storing data, which is a so called NoSQL database. NoSQL databases became very common just over 10 years ago, when the scaling of the internet started to produce problems for relational databases that utilized the older generation SQL query language.

Relational databases have since then experienced a new beginning. Problems with scalability have been partially resolved and they have also adopted some of the features of NoSQL databases. In this section we explore different NodeJS applications that use relational databases, we will focus on using the database PostgreSQL which is the number one in the open source world.

## PostgreSQL

Postgres is the leading open source relational database.

### Running Postgres on Fly.io

When creating a new project you can create a postgres database too. Run the following in a directory you want to start a new fly project:

```bash
fly launch
```

You will be prompted to answer some questions. Answer yes to "Would you like to set up a Postgresql database now?". Make a note of the password generated in this step as it is the only time you will get to see it.

You can open a psql console to the database as follows:

```bash
flyctl postgres connect -a <app-name>-db
```

### Running Postgres in Docker

Defined in this way, the data stored in the database is persisted only as long as the container exists. The data can be preserved by defining a volume for the data.
Run the Postgresql image with the following command:

```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```

Identify the container ID using:

```bash
docker ps
```

Then open a psql console inside of the container using:

```bash
docker exec -it <container_id> psql -U postgres postgres
```

## PSQL Console

When interfacing with postgres through the command line you will use the psql console. Some commands include:

```bash
\d                                                                                          # Displays the contents of the database
\d <table_name>                                                                             # Displays the schema of the table
CREATE TABLE <table_name> (<collum_name> <collum_type>, <collum_name> <collum_type>)        # Creates a new table with the specified collums
insert into <table_name> (<collum_name>, <collum_name>) values (value, value);              # Inserts a new row into a table with the specified data
select * from <table_name>                                                                  # Retrieves all rows in a table
```

## Creating a Node Application with PostgreSQL

Start in a new directory and initialize the project:

```bash
npm init
npm install express dotenv pg sequelize
```

Create a new file called index.js with the following contents:

```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

app.get('/api/notes', async (req, res) => {
  const notes = await sequelize.query('SELECT * FROM notes', {
    type: QueryTypes.SELECT,
  })
  res.json(notes)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

If the database is running on Fly.io we must tunnel the localhost port to the database using:

```bash
flyctl proxy 5432 -a <app-name>-db
```

Additionally we must add the following connection string to our .env file:

```env
DATABASE_URL=postgres://postgres:<password>@127.0.0.1:5432/postgres
```

If the database is hosted using Docker the connection string is:

```env
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

## Sequelize

Sequelize is an Object Relational Mapper that allows you to store JavaScript objects in a relational database without using the SQL language itself, similar to Mongoose that we used with MongoDB.

### Models

Create models to define the structure and requirements of data.

```js
const { Sequelize, Model, DataTypes } = require('sequelize')
// ...
class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note',
  }
)
```

### Queries

Use built in query functions on models to perform CRUD operations.

```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})
```

Some functions include:

- findAll()
- create()
- build()/save() # An alternative to create, where the new object isnt saved right away, so you can edit it and then save
