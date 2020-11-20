var express=require('express');
var app=express();
var faker=require('faker');
var mysql = require('mysql');
 var bodyParser=require('body-parser');
 var session = require('express-session');
 var http=require('http').createServer(app);
 var io=require('socket.io')(http);
 var methodOverride = require("method-override");
 var MySQLStore = require('express-mysql-session')(session);



 // app config
var users=[];
var connections=[]; 
// var options={
//     host     : 'localhost',
//     user     : 'root',
//     database : 'project',
//     password:'etuoryuojl',
//     connectionLimit:3,
//     port: 3306,
// }

var options={
    host     : 'sql12.freemysqlhosting.net',
    user     : 'sql12377808',
    database : 'sql12377808',
    password:'BwWI3hL7yp',
    connectionLimit:3,
    port: 3306,
}
var connection = mysql.createConnection(options); // or mysql.createPool(options);
var sessionStore = new MySQLStore({}/* session store options */, connection);
  app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));


//   app.use(session({
//     secret: 'secret',
//     resave: true,
// 	saveUninitialized: true
// }));








app.use(methodOverride("_method"));

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
 
app.get("/",function(req,res) {
    res.redirect("/signin");

})

app.get("/signin",function(req,res) {
    res.render("signin");
})

 

app.post('/signin', function(req, res) {
    
	var username = req.body.username;
	var password = req.body.password;
 		connection.query('SELECT * FROM newuser WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect("/inside");
			} else {
				res.render("error");
			}			
			res.end();
		});
	  
});

app.get("/inside",function(req,res) {
    if (req.session.loggedin) {
       // res.send('Welcome back, ' + request.session.username + '!');
        res.render("inside",{currentuser:req.session.username});
	} else {
		res.redirect("/signin");
	}
	res.end();
})
app.get("/signup",function(req,res) {
    var l='select COUNT(*) as total_users from newuser ';
    connection.query(l,function(error,result) {
        if(error) throw error;
        var ans=result[0].total_users;
        res.render("signup",{count:ans});
    })
   // res.render("signup");
})

app.post("/signup",function(req,res) {
    var person={
        username:req.body.username,
        password:req.body.password
    }
    var l='insert into newuser set ?';
    connection.query(l,person,function(error,result) {
        if(error) throw error;
        console.log(result);
    })
    res.redirect("/signin");
})



 ////   link 1 //////////
app.get("/createdoc",function(req,res) {
    if(req.session.loggedin) {
        res.render("newdocform",{currentuser:req.session.username});
    }else{
        res.redirect("/signin");
    }
})

app.post("/createdoc",function(req,res) {
    var doc={
        Doc_name:req.body.docname,
        created_by:req.session.username,
        AdminPassword:req.body.docpass
    }
    var l='INSERT INTO newdoc SET ?'; 
    connection.query(l,doc,function(error,result) {
        if(error) throw error;
        res.render("success",{docname:doc.Doc_name,created_by:doc.created_by});
    })
})

/////////// link 2 /////////////

app.get("/finddoc",function(req,res) {
    var currentuser=req.session.username;
    if(req.session.loggedin) {
        var q='SELECT * from newdoc WHERE created_by=?';
        var q2='SELECT * from newcollab WHERE collaborator_name=?'
    
        connection.query(q,currentuser,function(error,results,fields) {
            if(error) {
                console.log(error);
                res.render("error");
            }
            connection.query(q2,currentuser,function(error2,results2,fields2) {
                if(error) console.log(error2);
                if(results2.length>0) {
                    console.log(results);
                    console.log("****************************************")
                    console.log(results2);
                     res.render("collection",{found1:results,found2:results2,currentuser:currentuser})
                }else {
                    res.render("collection",{found1:results,found2:{},currentuser:currentuser})
                }
                
            })
        })
       
    }
})


/////////////// link 3 ///////////////////
app.get("/collabdoc",function(req,res) {
     res.render("collabdocform",{currentuser:req.session.username});
})


app.post("/collabdoc",function(req,res) {
    var doc={
        Doc_name:req.body.docname,
        collaborator_name:req.session.username,
        AdminPassword:req.body.passwordEntry
    };
    var doc2={
        Doc_name:req.body.docname,
        collaborator_name:req.session.username,
    }
    console.log(doc);
     var q1='SELECT * FROM newdoc WHERE Doc_name= ?';
    var q2='SELECT * FROM newdoc WHERE AdminPassword= ?';
    connection.query(q1,doc.Doc_name,function(error,results,fields) {
        if(error) {
            console.log(error);
            res.render("error");
        }else {
            connection.query(q2,doc.AdminPassword,function(error,results,fields) {
                if(results.length>0) {
                    console.log("results "+results);
                    var l='insert into newcollab set ?';
                    connection.query(l,doc2,function(error,results2,fields2) {
                        console.log("results2 "+results2);
                        if(error) {
                            res.render("error");
                        }else {
                            res.render("success2",{docname:doc.Doc_name,collaborator:doc.collaborator_name});
                        }
                        
                    })
                }else{
                    console.log(error);
                    res.render("error");
                }
            });
           
        }
        
     })
})


app.get("/documents/:doc",function(req,res) {
    var doc_name=req.params.doc;
    if(req.session.loggedin) {
        var query='select * from newdoc where Doc_name=?';
        connection.query(query,doc_name,function(error,found) {
            if(error) {res.render("error.ejs")};
            console.log(found);
            console.log(found[0]);
            res.render("field.ejs",{found:found[0],currentuser:req.session.username});
        })
    }else {
        res.redirect("/");
    }
   
})


app.put("/documents/:doc",function(req,res) {
    var doc_name=req.params.doc;
    var content=req.body.content;
    if(req.session.loggedin) {
        var query='select * from newdoc where Doc_name=?';
        connection.query(query,doc_name,function(error,found) {
            if(error) res.render("error");
            var query2='UPDATE newdoc SET content=? WHERE Doc_name=?';
            connection.query(query2,[content,doc_name],function(error,updated) {
                if(error) res.render("error");
                res.redirect("/documents/"+doc_name);
            })
        })
    }
})


app.delete("/documents/:doc",function(req,res) {
    var doc_name=req.params.doc;
    if(req.session.loggedin) {
        var query='DELETE FROM newdoc WHERE Doc_name=?';
        connection.query(query,doc_name,function(error,done) {
            if(error) {
                console.log(error);
                res.render("error");
            }else {
                res.redirect("/inside");
            }
        })
    }
})

app.get("/logout", function(req, res){
    req.session.loggedin=false;
    res.redirect("/signin");
 });



// app.post()
http.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });




 // socket configuration

 
 // socket configuration

 io.on('connection',function(socket) {
    connections.push(socket);
    console.log("Connected:user %s connected",connections.length);
    socket.on('disconnect',function() {
    users.splice(users.indexOf(socket.username),1);
     updateUsernames();
     connections.splice(connections.indexOf(socket),1);
     console.log("Connected:user %s connected",connections.length);
    })
    // document content
    socket.on('document',function(evt) {
        console.log(evt);
        io.emit('document',evt);
    })
    // chat messages
    socket.on('chat msg',function(data) {
        console.log("message:"+data);
        io.emit('send msg',{msg:data,user:socket.username});
    })

    socket.on('new user',function(data) {
        socket.username=data;
        console.log("new user:"+data);
        users.push(socket.username);
        updateUsernames();
    })
    function updateUsernames() {
        io.emit('get users',users);
    }

})