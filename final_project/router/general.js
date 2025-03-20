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
public_users.get('/',async function (req, res) {
  try {
    const books_array = await Promise.resolve(books);
    return res.send(JSON.stringify(books_array,null,4));
  } catch (error) {
    return res.send (error.message);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {

  try {
    const isbn = req.params.isbn;
    const books_array = await Promise.resolve(books);
    return res.send(JSON.stringify(books_array[isbn],null,4))
  } catch (error) {
    return res.send(error.message);
  }

 });
  

public_users.get('/author/:author',async function (req, res) {

try {
  const author = req.params.author;

  const books_array = await Promise.resolve(Object.values(books));

  const books_by_author = books_array.filter(book => book.author == author);
  
  return res.send(JSON.stringify(books_by_author,null,4));

} catch (error) {
  return res.send (error.message);
}
    

});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
    const title = req.params.title;

    const books_array = await Promise.resolve(Object.values(books));
  
    const books_with_title = books_array.filter(book => book.title == title);
  
    return res.send(JSON.stringify(books_with_title, null, 4)); 
  } catch (error) {
    return res.send (error.message);
  }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Get book by ISBN
  let filtered_book = books[req.params.isbn]

  // Get books reviews
  let reviews = filtered_book.reviews;

  return res.send(JSON.stringify(reviews, null, 4));
});

let getBook = new Promise((resolve, reject) => {
  return public_users.get
})


module.exports.general = public_users;
