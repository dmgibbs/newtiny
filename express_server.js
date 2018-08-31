var express = require("express");
// var cookieParser = require('cookie-parser')
var cookieSession = require("cookie-session");

const bcrypt = require('bcrypt');
/*----------------------------
if (username && password && password_confirm) {
    if (password === password_confirm) {
bcrypt.hash(password, SALT_ROUNDS, (err, password_hashed) => {
  if (err) {
          console.log("There was an error hashing the password", err);
        } else {
          const user = {
            id: nextUserId++,
            username,
            password: password_hashed
};
  */
var app = express();
// app.use(cookieParser());

var PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const bodyParser = require("body-parser"); //to access POST request params. eg. req.body.longURL
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  cookieSession({
    name: "session",
    keys: ["my-secret--key"],
    maxAge: 10 * 60 * 1000
  })
);


function generateRandomString() {
  let tmpStr = Math.random().toString(36).replace('0.', '');
  final = tmpStr.slice(0, 6);
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
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
  'd62m3k': 'http://www.yahoo.com',
  'g4YbR9': 'http://www.altavista.com',

};

var urlDB = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userid: "user3RanID"
  },
  "9sm5x7": {
    longURL: "http://www.google.com",
    userid: "usr5RandomID"
  },
  "b2xVn9": {
    longURL: "http://www.lighthouselabs.ca",
    userid: "b2xVn2"
  },
  "9te5xK": {
    longURL: "http://www.google.com",
    userid: "user2RandomID"
  },
  "3gDkE4": {
    longURL: "http://www.yahoo.com",
    userid: "user4RandomID"
  },
  "2nAdkE": {
    longURL: "http://www.clarify.com",
    userid: "abc182d"
  }
};

/*------------------------------------------------------
* get the Id of who is logged in from the cookies variable
--------------------------------------------------------*/
function whoIsLoggedIn(shortU) {
  for (let keys in urlDB) {
    if (keys === shortU)
      // console.log ("user is : -", user)   //.userid);
      console.log("routine called with  of : ", urlDB[keys].userid);
  }
  return shortU;
}

/*------------------------------------------------------
* function generates list of urls created by that user
--------------------------------------------------------*/
function urlsForUser(userid) {
  let list = {};
  for (var item in urlDB) {
    if (urlDB[item].userid === userid) {
      list[item] = urlDB[item].longURL;
    }
  }
  if (list === {}) {
    list = {
      "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userid: "user3RanID"
      }
    }
  }
  return list;
}

/*------------------------------------------------------
* fxn. stores the long/short Url generated by user.
* adds an entry to the UrlDB 
--------------------------------------------------------*/
function storeUrl(userId) {
  let lUrl = req.param.longUrl;
  let sUrl = req.param.shortUrl;
  //urlDB[sUrl] = {longURL:lUrl, userid:userId};
}

function fetchIdFromDB(email) {
  /*---------------------------------------------------------------
   * Returns the userId stored, based on the email for that user.
   *-----------------------------------------------------------------*/
  let theId = "";
  for (var user in users) {
    if (users[user]['email'] === email) { // if Emails match
      theId = users[user].id;
      break;
    }
  }
  return theId;
}

function isEmpty(str) {
  return (str === "") || (str === undefined);
}
/*-------------------------------------------------------------
 * Searches for an item in an list of objects.
 * returns true if key is found; false otherwise.
 *----------------------------------------------------------------*/
function foundEmail(DB, themail) {
  var found = false;
  for (var key in DB) {
    if (DB[key].email === themail) {
      found = true;
    }
  }
  return found;
}

function foundPass(DB, passwd) {
  // searches for a password in the user table.
  //returns true if password is found; false otherwise.
  var found = false;
  // bcrypt.compare(password, user.password, (err, result) => {
  for (var key in DB) {
    if (DB[key].password === passwd) {
      found = true;
    }
  }
  return found;
}

function fetchUser(id) {
  // using the ID, return an object storing the user information
  //return an empty object or return an object with info, found from user table

  for (var theUser in users) {
    if (users[theUser].id === id) {
      console.log(" match of user: ", users[theUser])
      return users[theUser];
    }
  }
}



app.get("/", (req, res) => {
  if (req.session && req.session.user_id) {
    res.render("/urls", {
      user: {
        email: "john@here.com"
      }
    });
  } else {
    res.render("login", {
      user: null
    });
  }
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {

  if (req.session && req.session.user_id) {
    var userid = req.session.user_id;
    console.log("This user has id of :", userid);
    let smallDB = urlsForUser(userid);
    let templateVars = {
      user: fetchUser(userid),
      urls: smallDB
    };
    res.render("urls_index", templateVars); // Use template file urls_index.ejs located in views folder
  } else {
    let errmsg = {
      err: "Cannot login due to an error with username/password."
    };
    res.render("error", errmsg);
  }
});

app.get("/urls/new", (req, res) => {
  let userid = req.session.user_id;
  let smallDB = urlsForUser(userid);
  let templateVars = {
    user: fetchUser(userid),
    urls: smallDB
  };

  // if user's cookie is not set then redirect to  /login
  if (!userid || userid === undefined) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// this captures everything else
app.get("/urls/:id", (req, res) => {
  var userid = req.session.user_id;
  let templateVars = {
    user: fetchUser(userid),
    shortUrl: req.params.id,
    longUrl: urlDB[req.params.id].longURL
  };
  res.render("urls_edit", templateVars);
});

app.get("/u/:shortUrl", (req, res) => {
  let longUrl = urlDB[req.params.shortUrl].longURL;
  console.log("The long Url is : ", longUrl);
  if (longUrl === undefined) {
    res.send("Unable to find key supplied");
  } else {
    res.redirect(longUrl); // is this correct ???
  }
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  res.render("login", {
    user: null
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    user: null
  });
});

app.post("/login", (req, res) => {

  var userEmail = req.body.email;
  var userPass = req.body.password;
  if (foundEmail(users, userEmail) && foundPass(users, userPass)) {
    console.log(" using this email :", userEmail);
    console.log("He has id of :", fetchIdFromDB(userEmail));
    // res.cookie("user_id", fetchIdFromDB(userEmail), {
    //   maxAge: 10 * 60 * 1000
    // });
    req.session.user_id = fetchIdFromDB(userEmail);
    console.log('storing cookie-session of : ', req.session.user_id);
    res.redirect("/urls");
    return;
  } else if (foundEmail(users, userEmail) && !foundPass(users, userPass)) {
    let errmsg = {
      err: "Unable to find the password. Please try again."
    };
    res.render("error", errmsg);
    return;
  } else {
    let errmsg = {
      err: "Invalid login, Please try again."
    };
    res.render("error", errmsg);
  }
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortUrl = generateRandomString();

  //let userid = req.cookies.user_id;
  let userid = req.session.user_id;


  urlDB[shortUrl] = {
    longURL: longURL,
    userid: userid
  };
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  var longUrl = req.body.longUrl;
  urlDB[req.params.id].longURL = longUrl;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // res.cookie("express.sid", "", {
  //   expires: new Date()
  // });
  // res.clearCookie('user_id');

  req.session = null;
  res.redirect("register");

});

app.post("/register", (req, res) => {
  var userEmail = req.body.email;
  var userPass = req.body.password;
  var username = req.body.name;


  if (isEmpty(userEmail) || isEmpty(userPass)) {
    res.status(401);
    res.redirect("/register");
    console.log(" registering but email or pass empty");
    return;
  }
  if (foundEmail(users, userEmail)) {
    res.status(400);
    console.log("attempting register on existing email")
    res.redirect("/login");
    return;
  }

  //   bcrypt.hash(password, SALT_ROUNDS, (err, password_hashed) => {
  //   if (err) {
  //     console.log("There was an error hashing the password", err);
  // }  else { 
  //Error checks passed ; register this user.
  let uid = generateRandomString(); // get a random Id
  //res.cookie('user_id', uid); // store this in cookie

  req.session.user_id = uid;

  users[uid] = {
    id: uid,
    email: userEmail,
    password: userPass
  }
  res.redirect("/login");
  //    }
  //    });
});

app.post("/urls/:id/delete", (req, res) => {
  let shortUrl = req.params.id;
  console.log("got to delete routine.")
  thisUser = whoIsLoggedIn(req.params.id); // get id of current cookie user
  //// show shorturls of logged in person
  console.log("the user called delete &  logged:", thisUser);
  //console.log("their shortUrls",getshortUrls(thisUser));
  delete urlDB[shortUrl];
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});