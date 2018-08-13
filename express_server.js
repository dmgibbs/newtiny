var express = require("express");
var cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');


var app = express();
app.use(cookieParser());

var PORT = 8080; // default port 8080
    // passing data to template which expects a value pair

app.set("view engine", "ejs");
const bodyParser = require("body-parser"); //to access POST request params. eg. req.body.longURL
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString()
{
  var tmpStr ="";

  tmpStr = Math.random().toString(36).replace('0.','');
  final = tmpStr.slice(0,6);
  return final;
}

const users = {
  "b2xVn2": {
    id: "b2xVn2",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
 "user3RandomID": {
    id: "user3RandomID",
    email: "anext1@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user4RandomID": {
    id: "user4RandomID",
    email: "thisguy@example.com",
    password: "deeswasher-slums"
  },
  "abc182d": {
    id: "abc182d",
    email: "fatjoe@tims.com",
    password: "aa"
  }
}

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca' ,
  '9sm5xK': 'http://www.google.com' ,
  'd62m3k': 'http://www.yahoo.com',
   'g4YbR9': 'http://www.altavista.com',

};

var urlDB = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca",
             userid: "user3RanID"},
  "9sm5x7": {longURL: "http://www.google.com",
             userid: "usr5RandomID"},
  "b2xVn9": {longURL: "http://www.lighthouselabs.ca",
             userid: "b2xVn2"},
  "9te5xK": {longURL: "http://www.google.com",
             userid: "user2RandomID"},
  "3gDkE4": {longURL: "http://www.yahoo.com",
             userid: "user4RandomID"}
};


/*------------------------------------------------------
* function generates list of urls created by that user
--------------------------------------------------------*/
function  urlsForUser(userid){
  let list = {};
    for (var item in urlDB)
    {
      if (urlDB[item].userid === userid){
        list[item] = urlDB[item].longURL;
      }
    }
    //console.log("This user has this list of items:",list);
    return list;
  }

/*------------------------------------------------------
* fxn. stores the long/short Url generated by user.
* adds an entry to the UrlDB 
--------------------------------------------------------*/

function storeUrl(userId){
  let lUrl = req.param.longUrl;
  let sUrl = req.param.shortUrl;
  console.log(" Value of Long and ShortUrls:", lUrl,sUrl);
  //urlDB[sUrl] = {longURL:lUrl, userid:userId};
}



function getUrls(user){
  // Filters out specific urls  for a specific user. Returns empty if user has no entries
  // associated with that ID.

  var myUrls ={};
}

function fetchIdFromDB(email) {
 /*---------------------------------------------------------------
 * Returns the userId stored, based on the email for that user.
 *-----------------------------------------------------------------*/ 
   let theId = ""; 
   for (var user in users)    {
     if ( users[user]['email'] === email){   // if Emails match
       theId = user;                         // grab the Id
       break;
     }
   }
   return theId;
 }

function isEmpty(str){
  return (str==="") || (str=== undefined);
}

function foundEmail(DB,themail){
// searches for an item in an list of objects.
//returns true if key is found; false otherwise.
  var found = false;
  for (var key in DB){
    if (DB[key].email === themail){
      found = true;
    }
  }
  return found;
}
function isUrlOwner(id,ListOfUrls)
{  // checks if the user list has an associated matching url
 // for (var url in ListOfUrls)


}

function foundPass(DB,passwd){
// searches for an item in an list of objects.
//returns true if key is found; false otherwise.
  var found = false;
  for (var key in DB){
    if (DB[key].password === passwd){
      found = true;
    }
  }
  return found;
}
function filterUrls(theDB, userId){
// Parse the url List and return all short and long urls for that user
  var mylist = {};

  var keys = Object.keys();

  for (var i=0;i < keys.length; i++)  {
    let theId = theDB[keys[i]].uid;
    if (theId === userId)
      mylist[keys[i]] = theDB[keys[i]].url;
  }
  return mylist;
}


function getUserObj(id){
// using the cookie information, return an object storing the user information
//return an empty object or return an object with info found from user table
  var user  = {};
  tmp = Object.values(id); // return an array of data with that key.
  if(!tmp) return [];
  else
    return tmp;
}

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
    console.log("cookie obj: "+req.cookies.user_id);
    if (req.cookies && req.cookies.user_id) {
      console.log(" cookies made."+ req.cookies.user_id);
      
      var  userid = req.cookies.user_id;
      let usrObj = {id:userid, userUrl:"www.yahoo.com"};
      let smallDB = urlsForUser(userid);
      console.log("--------smallDB items----------",smallDB);
      console.log("-------------------------------");
      let templateVars = {user: userid, urls:urlDatabase};
      let newVar = {user:usrObj,urls:urlDatabase};
     
      res.render("urls_index", templateVars);      // Use template file urls_index.ejs located in views folder
      //console.log("parameters sent:",req.body.longURL, req.params.longURL);
    }
    else{
      res.redirect("/login");
    }
});

app.get("/urls/new", (req, res) => {

  let  userid = req.cookies.user_id;
  let templateVars = {user:userid, urls:urlDatabase};
  // if user's cookie is not set then redirect to  /login
  if (!userid || userid === undefined) {
    console.log("redirect to login since no cookie found");
    res.redirect("/login");
  }
  else { res.render("urls_new",templateVars);}
});

// this captures everything else
app.get("/urls/:id", (req, res) => {
  var  userid = req.cookies.user_id;

  let templateVars = { user:req.cookies.user_id,shortUrl: req.params.id,longUrl : urlDatabase[req.params.id] };

  res.render("urls_edit", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDatabase[req.params.shortUrl];
  if (longUrl === undefined)  {
    res.send("Unable to find key supplied") ;
  }
  else  {  res.redirect(longUrl);}  // is this correct ???

});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  console.log('Login called !!');
  // if cookie exists then send them to /urls
  // else if no cookie -- then redirect them to registration page.
  //if (req.cookies.user_id)
  //  res.redirect("/urls");
  //else
    res.render("login");
});

app.get("/register", (req, res) => {
   res.render("register");
});

app.post("/login", (req, res) => {
  //console.log("login  post called: cookie:"+req.cookies.user_id );
  //var uid  = generateRandomString();
  //res.cookie('user_id',uid);
  var userEmail = req.body.email;
  var userPass = req.body.password;
  console.log("List of Users:"+ users);
  console.log ("user password is:",userPass);

  if (foundEmail(users,userEmail) && foundPass(users,userPass)) {
    //var someId = fetchIdFromDB(userEmail);
    res.cookie('user_id',fetchIdFromDB(userEmail));
    res.redirect("/urls");
    console.log(" pass + email found");
    return;
  }
  else if ( foundEmail(users,userEmail) && !foundPass(users,userPass)){
    console.log(" email found, pass bad");
    res.redirect("/login");
    return;
  }
  else
  {
    res.redirect("/register");
    return;
  }
});

app.post("/urls", (req, res) => {
  console.log("the request body stores: ",req.body);
  let longURL = req.body.longURL;
  let shortUrl = generateRandomString();
  let userid = req.cookies.user_id;
  console.log("user id is :",req.cookies.user_id);
  console.log("called routine to store longURL in db..");
  urlDatabase[shortUrl]= longURL;
  urlDB[shortUrl]= {longURL: longURL,userid:userid};

  console.log("---------------------------------");
  console.log("new db stores:", urlDB);
  console.log("---------------------------------");

  // Update 2nd DB with users details
  res.redirect("/urls");
  console.log("got here ??? in post urls");
});

app.post("/urls/:id", (req, res) => {
  //console.log("edit called with : "+ req.params.id);
  var longUrl = req.body.longUrl;
  console.log(" called /urls/:id");
  urlDatabase[req.params.id] = longUrl;
  urlDB[req.params.id] = longUrl;
  //console.log("current longurl: " +urlDatabase[req.params.id]);
  res.redirect("/urls");

});

app.post("/logout", (req, res) => {
  res.cookie("express.sid", "", { expires: new Date() });
  res.clearCookie('user_id');
  res.redirect("/urls");

});


app.post("/register", (req, res) => {
  var userEmail = req.body.email;
  var userPass = req.body.password;
  var username = req.body.name;
 

  if (isEmpty(userEmail) || isEmpty(userPass)){
    res.status(401);
    res.redirect("/register");
    console.log(" registering but email or pass empty");
    return;
  }
  if (foundEmail(users,userEmail) ){
      res.status(400);
      console.log("attempting register on existing email")
      res.redirect("/login");
      return;
  }
    // got this far; all ok - dump all contents to the users object
    let uid = generateRandomString();  // get a random Id
    res.cookie('user_id',uid);        // store this in cookie
    
    users[uid]= {id: uid, email: userEmail, password: userPass}
    res.redirect("/login");
});

app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  console.log("request.params stores: ",req.params);
  console.log('delete urls/id routine accessed : /id/delete');
  // cookie stores id. if cookie's id matchs the id for that shortUrl
  console.log("the current user doing delete: ",req.cookies.user_id);
  //console.log("display of both dbs")
  console.log("UrlDB2 : ",urlDB);
  console.log("---------------------");
  console.log("Long url asked for :",urlDB[shortUrl].longURL);
  console.log("id for this shortUrl: ",urlDB[shortUrl].userid);
  //if (isUrlOwner(req.cookies.userid, shortUrl))
    delete urlDatabase[shortUrl];
  //else  
   // console.log("Sorry , Urls can only be deleted by their owners.")
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
