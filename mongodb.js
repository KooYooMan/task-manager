//CRUD Create Read Update Delete 

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to the database')
    }   

    const db = client.db(databaseName)

    // db.collection('users').deleteMany({
    //     name: 'KooYooMan'
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // }) 

    db.collection('users').deleteOne({
        name: 'Manh Cao'
    }).then((result) => {
        console.log(result) 
    }).catch((error) => {
        console.log(error)
    })

})  