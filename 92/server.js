const express = require("express");
const app = express();
const path = require("path");
const url = require("url");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cookieParser = require("cookie-parser");
app.use(cookieParser())

var listenToPort = 3000;

const users = [];


const homedir = __dirname;


/*
//use it for inspection
var myMiddleware = function(req, res, next){
    console.log(req.url)
    next();
}
app.use(myMiddleware);
*/
//middlewares
var jsonParser = bodyParser.json();

app.use(express.static(path.join(homedir,"static/")));


var users = {};

var openRooms = [];
var rooms = {};

var id = 0;
var Room = function(){
    id++;
    this.id = id;
    this.full = false;
    this.users = [];
    this.join = function(user){
        var that = this.that;
        if(that.full){
            return false;
        }
        that.users.push(users[user]);
        users[user].roomid = that.id;
        if(users.length > 5){
            //start game
            this.full = true;
        }
        return true;
    }.bind({that:this});
    this.start = function(){
        this.full = true;
    }
};


app.post("/newuser",jsonParser,async(req,res){
    var name = req.body.username;
    if(name in users){
        //user already exists
        res.status(409).send("user already exists");
    }else{
        users[user] = {
            //status here
            naem:user
        };
        res.cookie(
            "username",
            name,
            {
                //expires: new Date(Date.now() + 10e3);
                secure: false,
                httponly:true
            }
        );
        res.status(201).send("user created successfully");
    }
});

app.post("/newroom",jsonParser,async(req,res){
    //return the roomid
    var room = new Room();
    var id = room.id;
    res.status(201).send(id);
});

app.post("/joinroom",jsonParser,async(req,res){
    //return the roomid
    var name = req.cookies["username"] || "";
    var id = req.body.roomid;
    var room = openRooms[id];
    var result = room.join(name);
    if(result){
        res.status(200).send();
    }else{
        //joining failed
        res.status(400).send();
    }
});

app.get("/status",jsonParser,async(req,res){
    //return the roomid
    var name = req.cookies["username"] || "";
    var user = users[name];
    var room = rooms[user.roomid];

    var players = room.users;
    for(var i = 0; i < players.length; i++){
        var player = players[i];
        //if(player === user){//this is the main user
        //
        //}
    }

    res.status(200).send(players);

    /*var id = req.body.roomid;
    var room = openRooms[id];
    var result = room.join(name);
    if(result){
        res.status(200).send();
    }else{
        //joining failed
        res.status(400).send();
    }*/
});


