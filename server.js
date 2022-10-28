//Add server code here!
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const PORT = 3000;
// process.env.PORT || 
app.use(express.static("public"))
const generateUniqueId = require('generate-unique-id');
const randomId = generateUniqueId({
  length: 3,
  useLetters: false
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"./views/index.html"))
})

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './views/notes.html'))
);

app.get('/api/notes',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            res.json(dataArr)
        }
    })
})

app.get('/api/notes/:id',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            console.log(req.params.id);
            for (let i = 0; i < dataArr.length; i++) {
                const note = dataArr[i];
                if(note.id==req.params.id) {
                    return res.json(note)
                }
            }
            res.status(404).json({
                msg:"book not found!"
            })
        }
    })
})

app.post('/api/notes/',(req,res)=>{
    fs.readFile("./db/db.json","utf-8",(err,data)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                msg:"oh no!",
                err:err
            })
        } else {
            const dataArr = JSON.parse(data);
            dataArr.push(req.body);
            fs.writeFile("./db/db.json",JSON.stringify(dataArr,null,4),(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).json({
                        msg:"oh no!",
                        err:err
                    })
                }
                else {
                    res.json({
                        msg:"successfully added!"
                    })
                }
            })
        }
    })
})

// app.delete('/user', (req, res) => {
//     res.send('Got a DELETE request at /user')
//   })
// app.delete('/api/notes/',(req,res)=>{
//     fs.readFile("./db/db.json","utf-8",(err,data)=>{
//         if(err){
//             console.log(err);
//             res.status(500).json({
//                 msg:"oh no!",
//                 err:err
//             })
//         } else {
//             const dataArr = JSON.parse(data);
//             dataArr.splice(req.body);
//             fs.writeFile("./db/db.json",JSON.stringify(dataArr,null,4),(err,data)=>{
//                 if(err){
//                     console.log(err);
//                     res.status(500).json({
//                         msg:"oh no!",
//                         err:err
//                     })
//                 }
//                 else {
//                     res.json({
//                         msg:"successfully removed!"
//                     })
//                 }
//             })
//         }
//     })
// })



app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"./views/404.html"))
})

app.listen(PORT,()=>{
    console.log(`listen in on port ${PORT}`)
})