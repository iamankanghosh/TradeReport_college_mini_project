const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
const cookieparser = require("cookie-parser");
require("./db/connection");
const register = require("./model/regschema");
const Register = require('./model/regschema');
const app = express();
const port = process.env.PORT || 4200;


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views") 
const partial_path = path.join(__dirname,"../templates/partials")
app.set('view engine','hbs')
app.set('views',template_path);
hbs.registerPartials(partial_path);
app.use(express.static(static_path));
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));

let prevgaindata=[]
let prevlosedata =[]
let prevmostact =[]

app.get("/",async(req,res)=>{
    if (!req.cookies.sett) {
        res.render('intro')
    }
    else{
        try {
            const response = await fetch('https://stock-nse-india.herokuapp.com/api/gainersAndLosers/NIFTY%2050');
            const data = await response.json();
            const gaindata =[
                {"no":"1","name" : data.gainers[0].symbol,"ltp" : data.gainers[0].lastPrice,"chg" :  data.gainers[0].pChange},
                {"no":"2","name" : data.gainers[1].symbol,"ltp" : data.gainers[1].lastPrice,"chg" :  data.gainers[1].pChange},
                {"no":"3","name" : data.gainers[2].symbol,"ltp" : data.gainers[2].lastPrice,"chg" :  data.gainers[2].pChange},
                {"no":"4","name" : data.gainers[3].symbol,"ltp" : data.gainers[3].lastPrice,"chg" :  data.gainers[3].pChange},
                {"no":"5","name" : data.gainers[4].symbol,"ltp" : data.gainers[4].lastPrice,"chg" :  data.gainers[4].pChange}
            ]
            prevgaindata = gaindata;
            const losedata =[
                {"no":"1","name" : data.losers[0].symbol,"ltp" : data.losers[0].lastPrice,"chg" :  data.losers[0].pChange},
                {"no":"2","name" : data.losers[1].symbol,"ltp" : data.losers[1].lastPrice,"chg" :  data.losers[1].pChange},
                {"no":"3","name" : data.losers[2].symbol,"ltp" : data.losers[2].lastPrice,"chg" :  data.losers[2].pChange},
                {"no":"4","name" : data.losers[3].symbol,"ltp" : data.losers[3].lastPrice,"chg" :  data.losers[3].pChange},
                {"no":"5","name" : data.losers[4].symbol,"ltp" : data.losers[4].lastPrice,"chg" :  data.losers[4].pChange}
            ]
            prevlosedata = losedata;
            const response1 = await fetch('https://stock-nse-india.herokuapp.com/api/mostActive/NIFTY%2050');
            const data1 = await response1.json();
            const mostact =[
                {"no":"1","name" : data1.byValue[1].symbol,"ltp" : data1.byValue[1].lastPrice,"chg" :  data1.byValue[1].pChange},
                {"no":"2","name" : data1.byValue[2].symbol,"ltp" : data1.byValue[2].lastPrice,"chg" :  data1.byValue[2].pChange},
                {"no":"3","name" : data1.byValue[3].symbol,"ltp" : data1.byValue[3].lastPrice,"chg" :  data1.byValue[3].pChange},
                {"no":"4","name" : data1.byValue[4].symbol,"ltp" : data1.byValue[4].lastPrice,"chg" :  data1.byValue[4].pChange},
                {"no":"5","name" : data1.byValue[5].symbol,"ltp" : data1.byValue[5].lastPrice,"chg" :  data1.byValue[5].pChange}
            ]
            prevmostact =mostact;
            res.render('index',{mostactive: mostact,gainer: gaindata,loser:losedata})
        }catch(error) {
            console.log(error);
            res.render('index',{mostactive: prevmostact,gainer: prevgaindata,loser:prevlosedata})
        } 
    }
})
app.get("/worldindices",(req,res)=>{
    res.render('worldindices')
})
app.get("/currency",(req,res)=>{
    res.render('currency')
})
app.get("/crypto",(req,res)=>{
    res.render('crypto')
})
app.get("/nifty50",async(req,res)=>{
    const indexdata=[]
    const response = await fetch('https://stock-nse-india.herokuapp.com/api/index/NIFTY%2050');
    const data = await response.json();
    for (let i = 0; i < 50; i++) {
        let inddata={"no":i+1,"symbol":data.data[i+1].symbol,"name":data.data[i+1].meta.companyName,"industry":data.data[i+1].meta.industry,"ltp":data.data[i+1].lastPrice,"chg":data.data[i+1].change,"dayhigh":data.data[i+1].dayHigh,"daylow":data.data[i+1].dayLow}
        indexdata.push(inddata)
    }
    res.render('nifty50',{indexdata:indexdata})
})
app.get("/banknifty",async(req,res)=>{
    const indexdata=[]
    const response = await fetch('https://stock-nse-india.herokuapp.com/api/index/NIFTY%20BANK');
    const data = await response.json();
    for (let i = 1; i < 12; i++) {
        let inddata={"no":i+1,"symbol":data.data[i+1].symbol,"name":data.data[i+1].meta.companyName,"industry":data.data[i+1].meta.industry,"ltp":data.data[i+1].lastPrice,"chg":data.data[i+1].change,"dayhigh":data.data[i+1].dayHigh,"daylow":data.data[i+1].dayLow}
        indexdata.push(inddata)
    }
    res.render('banknifty',{indexdata:indexdata})
})
app.get("/calender",(req,res)=>{
    res.render('calender')
})
app.get("/capitalized",(req,res)=>{
    res.render('capitalized')
})
app.get("/weekhigh",(req,res)=>{
    res.render('weekhigh')
})
app.get("/weeklow",(req,res)=>{
    res.render('weeklow')
})
app.get("/sma50",(req,res)=>{
    res.render('sma50')
})
app.get("/balance",(req,res)=>{
    res.render('balance')
})
app.get("/invest",(req,res)=>{
    res.render('invest')
})

app.get("/login",(req,res)=>{
    res.render('login')
})
//use for trial perpous only
// app.get("/temp",(req,res)=>{
//     res.render('temp')
// })
app.post("/register",async(req,res)=>{
    try {
        const registeruser = new register({
            firstname:req.body.fname,
            lastname:req.body.lname,
            password:req.body.password,
            username:req.body.username
        })
        res.cookie("sett",req.body.username);
        const registered = await registeruser.save();
        try {
            const response = await fetch('https://stock-nse-india.herokuapp.com/api/gainersAndLosers/NIFTY%2050');
            const data = await response.json();
            const gaindata =[
                {"no":"1","name" : data.gainers[0].symbol,"ltp" : data.gainers[0].lastPrice,"chg" :  data.gainers[0].pChange},
                {"no":"2","name" : data.gainers[1].symbol,"ltp" : data.gainers[1].lastPrice,"chg" :  data.gainers[1].pChange},
                {"no":"3","name" : data.gainers[2].symbol,"ltp" : data.gainers[2].lastPrice,"chg" :  data.gainers[2].pChange},
                {"no":"4","name" : data.gainers[3].symbol,"ltp" : data.gainers[3].lastPrice,"chg" :  data.gainers[3].pChange},
                {"no":"5","name" : data.gainers[4].symbol,"ltp" : data.gainers[4].lastPrice,"chg" :  data.gainers[4].pChange}
            ]
            prevgaindata = gaindat
            const losedata =[
                {"no":"1","name" : data.losers[0].symbol,"ltp" : data.losers[0].lastPrice,"chg" :  data.losers[0].pChange},
                {"no":"2","name" : data.losers[1].symbol,"ltp" : data.losers[1].lastPrice,"chg" :  data.losers[1].pChange},
                {"no":"3","name" : data.losers[2].symbol,"ltp" : data.losers[2].lastPrice,"chg" :  data.losers[2].pChange},
                {"no":"4","name" : data.losers[3].symbol,"ltp" : data.losers[3].lastPrice,"chg" :  data.losers[3].pChange},
                {"no":"5","name" : data.losers[4].symbol,"ltp" : data.losers[4].lastPrice,"chg" :  data.losers[4].pChange}
            ]
            prevlosedata = losedata;
            const response1 = await fetch('https://stock-nse-india.herokuapp.com/api/mostActive/NIFTY%2050');
            const data1 = await response1.json();
            const mostact =[
                {"no":"1","name" : data1.byValue[1].symbol,"ltp" : data1.byValue[1].lastPrice,"chg" :  data1.byValue[1].pChange},
                {"no":"2","name" : data1.byValue[2].symbol,"ltp" : data1.byValue[2].lastPrice,"chg" :  data1.byValue[2].pChange},
                {"no":"3","name" : data1.byValue[3].symbol,"ltp" : data1.byValue[3].lastPrice,"chg" :  data1.byValue[3].pChange},
                {"no":"4","name" : data1.byValue[4].symbol,"ltp" : data1.byValue[4].lastPrice,"chg" :  data1.byValue[4].pChange},
                {"no":"5","name" : data1.byValue[5].symbol,"ltp" : data1.byValue[5].lastPrice,"chg" :  data1.byValue[5].pChange}
            ]
            prevmostact = mostact;
            res.render('index',{mostactive: mostact,gainer: gaindata,loser:losedata})
        }catch(error) {
            res.render('index',{mostactive: prevmostact,gainer: prevgaindata,loser:prevlosedata})
        }
    } catch (error) {
        res.render('login');
    }
})
app.post("/login",async(req,res)=>{
    try {
        const username = req.body.usernamelog;
        const password = req.body.passwordlog;
        const data = await Register.findOne({username:username})
        const isMatch = await bcrypt.compare(password,data.password);
        if (isMatch == true) {
            res.cookie("sett",req.body.username);
            try {
                const response = await fetch('https://stock-nse-india.herokuapp.com/api/gainersAndLosers/NIFTY%2050');
                const data = await response.json();
                const gaindata =[
                    {"no":"1","name" : data.gainers[0].symbol,"ltp" : data.gainers[0].lastPrice,"chg" :  data.gainers[0].pChange},
                    {"no":"2","name" : data.gainers[1].symbol,"ltp" : data.gainers[1].lastPrice,"chg" :  data.gainers[1].pChange},
                    {"no":"3","name" : data.gainers[2].symbol,"ltp" : data.gainers[2].lastPrice,"chg" :  data.gainers[2].pChange},
                    {"no":"4","name" : data.gainers[3].symbol,"ltp" : data.gainers[3].lastPrice,"chg" :  data.gainers[3].pChange},
                    {"no":"5","name" : data.gainers[4].symbol,"ltp" : data.gainers[4].lastPrice,"chg" :  data.gainers[4].pChange}
                ]
                prevgaindata = gaindata;
                const losedata =[
                    {"no":"1","name" : data.losers[0].symbol,"ltp" : data.losers[0].lastPrice,"chg" :  data.losers[0].pChange},
                    {"no":"2","name" : data.losers[1].symbol,"ltp" : data.losers[1].lastPrice,"chg" :  data.losers[1].pChange},
                    {"no":"3","name" : data.losers[2].symbol,"ltp" : data.losers[2].lastPrice,"chg" :  data.losers[2].pChange},
                    {"no":"4","name" : data.losers[3].symbol,"ltp" : data.losers[3].lastPrice,"chg" :  data.losers[3].pChange},
                    {"no":"5","name" : data.losers[4].symbol,"ltp" : data.losers[4].lastPrice,"chg" :  data.losers[4].pChange}
                ]
                prevlosedata = losedata;
                const response1 = await fetch('https://stock-nse-india.herokuapp.com/api/mostActive/NIFTY%2050');
                const data1 = await response1.json();
                const mostact =[
                    {"no":"1","name" : data1.byValue[1].symbol,"ltp" : data1.byValue[1].lastPrice,"chg" :  data1.byValue[1].pChange},
                    {"no":"2","name" : data1.byValue[2].symbol,"ltp" : data1.byValue[2].lastPrice,"chg" :  data1.byValue[2].pChange},
                    {"no":"3","name" : data1.byValue[3].symbol,"ltp" : data1.byValue[3].lastPrice,"chg" :  data1.byValue[3].pChange},
                    {"no":"4","name" : data1.byValue[4].symbol,"ltp" : data1.byValue[4].lastPrice,"chg" :  data1.byValue[4].pChange},
                    {"no":"5","name" : data1.byValue[5].symbol,"ltp" : data1.byValue[5].lastPrice,"chg" :  data1.byValue[5].pChange}
                ]
                prevmostact =mostact;
                res.render('index',{mostactive: mostact,gainer: gaindata,loser:losedata})
            }catch(error) {
                res.render('index',{mostactive: prevmostact,gainer: prevgaindata,loser:prevlosedata})
            }
        } else {
            res.render('login');
        }
    } catch (error) {
        res.render('login');
    }
}) 
app.get("*",(req,res)=>{
    res.render('error')
})


















































app.listen(port,()=>{
    console.log(`listening port at ${port}`);
})
