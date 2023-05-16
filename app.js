const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')

const app = express()

const port = 7382

const database = new Sequelize({
    dialect: 'sqlite',
    storage: './databse.sqlite'
});

// definir modelos
const Library = database.define('library', {
    // id, nombre, localidad, telefono
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    place: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 50], // length
        }
    },
    phone: {
        type: DataTypes.STRING,
        validate: {
            len: [0, 20], // length
        }
    }
})

app.use(express.json())

app.post('/library', async (req, res) => {
    // nombre, localidad, telefono
    const { name, place, phone } = req.body
    const reqJson = { name, place, phone }
    console.log(reqJson);

    try{
        // guardar en variable la instancia del modelo
        const newLibrary = Library.build(reqJson)
        // validar instancia
        await newLibrary.validate()
        // guardar en la base de datos
        await newLibrary.save()

        res
        .status(201)
        .json()
        .end()
    } catch( error ){
        console.log(error);
        res
        .json(error)
        .status(401)
        .end()
    }
})

app.get('/library/:id', async (req, res) => {
    const {id} = req.params

    const thisLibrary = await Library.findByPk(id);

    res
    .status(200)
    .json(thisLibrary)
    .end()
})

app.get('/library', async (req, res) => {
    const allLibraries = await Library.findAll()
    console.log(allLibraries);
    res
    .status(200)
    .json(allLibraries)
    .end()
})
app.get('/library/name/:name', async (req, res) => {
    const name = req.params.name

    const thisLibrary = await Library.findAll({
        where: {
            name: name,
        }
    })


    res
    .status(200)
    .json(thisLibrary)
    .end()

})

app.delete('/library/:id', async (req, res) => {
    const id = req.params.id
    console.log(id);
    await Library.destroy({
        where: {
            id: id
        }
    })
    .then(message => {
        res.json(message).end()
    })
})

app.put('/library/:id', async (req, res) => {
    try{
        const id = req.params.id
        const { name } = req.body

        await Library.update({name: name}, {
            where: {
                id: id
            }
        })

        res
        .status(201)
        .json({newName: name})
        .end()
    } catch(error){
        console.log(error);
    }
})

app.listen(port, async () => {
    try{
        await database.sync()
        await database.authenticate()
        console.log('databse running');
    } catch(error){
        console.log(error);
    }
    console.log(`server running on port ${port}`);
})