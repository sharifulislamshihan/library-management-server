const express = require('express');
const cors = require('cors');
const app = express();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsbi62n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        // database name and collection name
        const bookCollection = client.db('libraryDB').collection('books');


        // Get operation (read data)
        app.get('/books', async(req, res) =>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const cursor = bookCollection
            .skip(page * size)
            .limit(size)
            .find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get a single book data using id
        app.get('/books/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {
                _id : new ObjectId(id),
            }
            const result = await bookCollection.findOne(query);
            res.send(result);
        })

        // to see number of document in the collection
        app.get('/booksCount', async(req, res) =>{
            const count = await bookCollection.estimatedDocumentCount();
            res.send({count})
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('library server is running');
})

app.listen(port, () => {
    console.log(`library server running on port ${port}`);
})