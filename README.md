# TinyApp Project 

TinyApp is a full stack web application, built with node and express that allows users to shorten URLs.


#Some Screenshots

Registration
(https://github.com/dmgibbs/newtiny/blob/master/screenshots/Tiny%20registration.png)

Adding an url
(https://github.com/dmgibbs/newtiny/blob/master/screenshots/addnewurl.png)

Url added to list.
(https://github.com/dmgibbs/newtiny/blob/master/screenshots/urladded.png)

User Logged in.
(https://github.com/dmgibbs/newtiny/blob/master/screenshots/userLoggedin.png)

# Project Dependencies
+ The following modules will be required for this project.

#Dependencies
+body-parser 1.18.3
+cookie-session   2.0.0-beta.3
+ejs: 1.0.0
+express : 4.16.3
+nodemon : 1.18.3
+bcrypt  : 2.0.0

# Instructions on How to SETUP the App.

1. Clone this repository from https://github.com/dmgibbs/newtiny
2. Install dependencies using the `npm install` command.
3. Start the web server using the `npm start` command. The app will be served at <http://localhost:8080/>.
4. Go to <http://localhost:8080/> in your browser.


# Instructions on How to USE the App to make TINYURLS!

1. User registers from the main window, with a unique username and password
2. User then "logs in" with the previously entered "username" and password.
3. User is then able to "add" a new LONG URL  (eg. http://somewhere.com) , and the system will generate a "tiny" url for that supplied URL.

+ Eg. user enters   http://www.google.com   &&  the system will return a SHORTURL - 6 characters long.  You can visit the longUrl by clicking on the SHORTURL that was generated.

+ Note: Users can change/delete the LongUrl at any point in time from the menu. Users can also logout from the system at any point in time.


