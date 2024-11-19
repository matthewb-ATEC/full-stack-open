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

To connect in development open a proxy tunnel using:

```bash
flyctl proxy 5432 -a <app_name>-db
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
CREATE TABLE <table_name> (<column_name> <column_type>, <column_name> <column_type>)        # Creates a new table with the specified columns
insert into <table_name> (<column_name>, <column_name>) values (value, value);              # Inserts a new row into a table with the specified data
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
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
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
- findByPk() # Finds the row with the given primary key
- destroy( where { <column_name> : <value> } ) # Removes a row matching the given condition(s)
- findOne( where { <column_name> : <value> } ) # Returns the first row with matching criteria

## Console Logging Data

When logging data retrieved from a postgres database the easiest soltuion is to use stringify:

```javascript
JSON.stringify(notes, null, 2)
```

## Deriving Table Schema from Models

Sequelize can automatically generate the table scheme from a model using the sync method.

```javascript
Note.sync()
```

## Foreign Keys

Foreign keys reference rows from other tables. We can establish these relationships before we initialize the schema of the tables based on the models.

```javascript
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)
Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note,
  User,
}
```

Sequelize will automatically create an attribute called userId on the Note model to which, when referenced gives access to the database column user_id. Alternatively you can explicitly define the userId attribute as follows:

```javascript
Note.init(
  {
    // ...
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'note',
  }
)

module.exports = Note
```

## Join Queries

Instead of using mongoose's Populate method we can use the include parameter to fill in the model data associated with a foreign key.

```javascript
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
    },
  })
  res.json(users)
})
```

## Validation

Sequelize offers many pre built validators and you can also make your own. https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/

## Query Parameters

For more complex queries we must use query parameters to pass information about the type of criteria we intend to return. In the url these appear after the endpoint starting with a question mark and joined by an ampersand.

protocol://host:port/api/endpoint?parameter=value&parameter=value

Use sequelize operators to define and manage the options of these parameters: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators

```javascript
router.get('/', async (req, res) => {
  const where = {}

  if (req.query.important) {
    where.important = req.query.important === 'true'
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search,
    }
  }

  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
  })

  res.json(notes)
})
```

## Migrations

Migrations are a way to track and apply the changes to the database schema similar to version control and alternative the the sync() method.

## Many-to-Many Relationships

When initializing our schema from the models, we can define the relationship as follows:

```javascript
User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

The above relation defines the models User and Team have a many to many relationship through the Membership table.

The migration to add a table that connects two existing tables is as follows:

```javascript
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('user_blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      note_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('user_blogs')
  },
}
```

The model for this relationship is as follows:

```javascript
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserBlogs extends Model {}

UserBlogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    noteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user_blogs',
  }
)

module.exports = UserBlogs
```

## Aliases

Some instances may cause attribute names to overlap, and in such cases we want to use an alias to rename the attribute to a unique name:

```javascript
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })
```

The join query looks as follows:

```javascript
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: Note,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
      },
      // ...
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

## Eager vs Lazy Fetch

By defauly using an include parameter on a sequelize query will fetch all of the rows of the referenced tables by the join query. Sometimes we only want to fetch these rows conditionally, and this can be done using a lazy fetch.

```javascript
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [''] },
    include: [
      {
        model: note,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Note,
        as: 'marked_notes',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: [],
        },
        include: {
          model: user,
          attributes: ['name'],
        },
      },
    ],
  })

  if (!user) {
    return res.status(404).end()
  }

  // This is the lazy fetch, it only getches the teams if the query parameter is not null
  let teams = undefined
  if (req.query.teams) {
    // Sequelize automatically generates the getTeams method for the teams model
    teams = await user.getTeams({
      attributes: ['name'],
      joinTableAttributes: [],
    })
  }
  res.json({ ...user.toJSON(), teams })
})
```

## Model Scopes

Scopes allow us to handle only certain rows of a table by default.

```javascript
class User extends Model {}

User.init(
  {
    // field definition
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user',

    defaultScope: {
      where: {
        disabled: false,
      },
    },
    scopes: {
      admin: {
        where: {
          admin: true,
        },
      },
      disabled: {
        where: {
          disabled: true,
        },
      },
      name(value) {
        return {
          where: {
            name: {
              [Op.iLike]: value,
            },
          },
        }
      },
    },
  }
)

module.exports = User
```

The above model performs a findAll() request with a where condition: WHERE "user". "disabled" = false;

Scopes are used as follows:

```javascript
// all admins
const adminUsers = await User.scope('admin').findAll()

// all inactive users
const disabledUsers = await User.scope('disabled').findAll()

// users with the string jami in their name
const jamiUsers = await User.scope({ method: ['name', '%jami%'] }).findAll()copy
```

It is also possible to chain scopes:

```javascript
// admins with the string jami in their name
const jamiUsers = await User.scope('admin', {
  method: ['name', '%jami%'],
}).findAll()
```

## Custom Model Methods

Since models are javascript classes we can add functions to them.

```javascript
const { Model, DataTypes, Op } = require('sequelize')

const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {
  async number_of_notes() {
    return (await this.getNotes()).length
  }
  static async with_notes(limit) {
    return await User.findAll({
      attributes: {
        include: [
          [sequelize.fn('COUNT', sequelize.col('notes.id')), 'note_count'],
        ],
      },
      include: [
        {
          model: Note,
          attributes: [],
        },
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`),
    })
  }
}

User.init({
  // ...
})

module.exports = User
```

The number_of_notes() method is an instance method that can be called on an instance of the Notes model as follows:

```javascript
const jami = await User.findOne({ name: 'Jami Kousa' })
const cnt = await jami.number_of_notes()
console.log(`Jami has created ${cnt} notes`)
```

The second of the methods, which returns those users who have at least X, the number specified by the parameter, amount of notes is a class method, i.e. it is called directly on the model:

```javascript
const users = await User.with_notes(2)
console.log(JSON.stringify(users, null, 2))
users.forEach((u) => {
  console.log(u.name)
})
```
