//Add server code here!
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

app.use(express.static("public"))
const generateUniqueId = require('generate-unique-id');
const randomId = generateUniqueId({
    length: 3,
    useLetters: false,
    useNumbers: true
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./views/index.html"))
})

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './views/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "uh oh!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})
// search specific notes, because why not
app.get('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "uh oh!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            console.log(req.params.id);
            for (let i = 0; i < dataArr.length; i++) {
                const note = dataArr[i];
                if (note.id == req.params.id) {
                    return res.json(note)
                }
            }
            res.status(404).json({
                msg: "note not found!"
            })
        }
    })
})

app.post('/api/notes/', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "uh oh!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            // add random id to new notes
            req.body.id = randomId;
            dataArr.push(req.body);
            fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        msg: "uh oh!",
                        err: err
                    })
                }
                else {
                    res.json({
                        msg: "successfully added!"
                    })
                }
            })
        }
    })
})


// delete notes
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                msg: "oh no!",
                err: err
            })
        } else {
            const dataArr = JSON.parse(data);
            for (let i = 0; i < dataArr.length; i++) {
                const note = dataArr[i];
                if (note.id == req.params.id) {
                    dataArr.pop(note);
                    fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err, data) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({
                                msg: "oh no!",
                                err: err
                            })
                        }
                        else {
                            res.json({
                                msg: "successfully removed!"
                            })
                        }
                    })
                }
            }
        }
    })
})



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./views/404.html"))
})

app.listen(PORT, () => {
    console.log(`listen in on port ${PORT}`)
})