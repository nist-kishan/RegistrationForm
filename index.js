const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const { error } = require('console')

const PORT = process.env.PORT || 4000

const app = express();

const uri = "mongodb+srv://kishanrajrby2:qKQkg3CXUvEcOeO5@bharatintern.wv7vp7s.mongodb.net/BharatIntern?retryWrites=true&w=majority";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const ConnectDb = async () => {
    try {
        mongoose.connect(uri)
        console.log("Connected successfully")
    } catch (err) {
        console.log(error)
    }
}

const userdetailSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true
        },
        email: {
            type: String,
            unique: true,
            require: true
        },
        phoneNo: {
            type: Number,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    }
)

let model = mongoose.model('users', userdetailSchema)

app.get('/', (req, resp) => {
    resp.set({ "Allow-access-Allow-origin": '*' })
    return resp.redirect('index.html')
})

app.post('/sign_up', async (req, resp) => {
    let { name, email, phoneNo, password } = req.body;

    let data = new model({
        "name": name,
        "email": email,
        "phoneNo": phoneNo,
        "password": password
    })

    await ConnectDb();
    try {
        let result = await data.save()
        console.log('Successfully Save the data into database and your data is')
        console.log(result)
        return resp.redirect("signup_success.html")
    } catch (error) {
        console.log("YOur email is alrealy resigtered So,PLease fill other email")
        return resp.redirect("emailAlreadyReg.html")
    }
})

app.listen(PORT, () => {
    console.log(`Connect at port number ${PORT}`)
})

