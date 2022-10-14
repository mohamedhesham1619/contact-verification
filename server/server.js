const express = require('express')
const { processExcileFile, currentProgress } = require('./excel');
const multer = require('multer')
const fs = require('fs')

const upload = multer({ dest: 'uploads/' })

const app = express()


app.post('/file_upload', upload.single('file'), async (req, res) => {
    const formData = req.file
    res.end()
    let filePath = __dirname + '\\' + formData.path
    await processExcileFile(filePath)

    // remove the file after the process finish
    fs.rm(filePath, (err) => {
        if (err) {
            console.log(err)
        }
    }) 

})

app.get('/current_progress', (req, res) => {
    res.json(currentProgress())
})

app.get('/download', (req, res) => {
    res.download(`${__dirname}/output.xlsx`)
})



app.listen(8080, () => console.log('listen on port 8080 ...'))