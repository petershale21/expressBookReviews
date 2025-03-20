const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
  let current_user = req.session.authorization.username;
  let user_review = req.body.review;
  let book = books[req.params.isbn]

  if (book) {
    book.reviews[current_user] = user_review;
  }

  else {
    return res.status(404).send("Book not found")
  }
  return res.send(`Here are the new book details ${JSON.stringify(book, null, 4)}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let current_user = req.session.authorization.username;
  let book = books[req.params.isbn];

  if (book) {
    delete book.reviews[current_user];
  }

  else {
    return res.status(404).send("Book not found");
  }

  return res.send(`Your review has been deleted. The remaining reviews are shown below \n ${JSON.stringify(book, null, 4)}`);

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
