const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
// return books object in JSON format
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
//return book object in JSON format assuming unique ISBN
  let filtered_book = books[req.params.isbn]
  return res.send(JSON.stringify(filtered_book,null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
// Get keys from books object
  let books_array = Object.values(books);
  
// filter books by author
  let books_by_author = books_array.filter(book => book.author == req.params.author);

  return res.send(JSON.stringify(books_by_author,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Get keys from books object
  let books_array = Object.values(books);

  // filter books by title
  let books_with_title = books_array.filter(book => book.title == req.params.title);

  return res.send(JSON.stringify(books_with_title, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Get book by ISBN
  let filtered_book = books[req.params.isbn]

  // Get books reviews
  let reviews = filtered_book.reviews;

  return res.send(JSON.stringify(reviews, null, 4));
});


module.exports.general = public_users;
