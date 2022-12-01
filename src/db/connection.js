const mongoose = require ('mongoose');
mongoose.connect("mongodb+srv://test:test1234@cluster0.uazj7.mongodb.net/stock_db?retryWrites=true&w=majority")
.then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log("error is = "+err);
})