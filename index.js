const express = require("express");
const app = express();
const port = 3000;
const { connectDB, closeDB, client } = require("./db/database");
const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs")
app.use(express.static('img'))
app.use(express.static('style'))
app.use(express.static('views'))


connectDB();

app.get("/kerja-projek", async (req,res) => {
    res.render("index" , {
        massage: "",
    })
})



app.post("/feedback", async (req,res) => {

    
    const {user, email, coment,time} = req.body;
    const dbzidan = await client.db("databasejidan");
    const zidanfeedback = dbzidan.collection("feedback");
    await zidanfeedback.insertOne({user,email,coment,time});
    res.json({kondisi: "sukses"});

})



app.get("/admin", async (req,res)=> {
    const db = await  client.db("databasejidan");
    const cl = await db.collection("feedback");
    const data = await cl.find({}).toArray();
    res.render("admin", {data});
});


app.delete("/delete", async(req,res)=> {
    const {user}= req.body;
    console.log(user);
    const db = await client.db("databasejidan");
    const cl= await db.collection("feedback");
    const dl = await cl.deleteOne({_id:new ObjectId(user)});
    console.log(dl.deletedCount);
    res.send(req.body);
})



process.on('SIGINT', async () => {
    await closeDB();
    process.exit();
});


app.listen(port,() => {
    console.log("berhasil masuk di port 3000");
})