const express=require('express')
const port=8080
const app=express()

app.use(express.json())

app.listen(port,()=>{
    console.log(`listening at ${port}`)
})