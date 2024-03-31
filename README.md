# bookstore <img src="https://github.com/lucaimbalzano/bookstore/assets/45575898/ce0deb10-5391-469b-94c0-e70070927949" width="60" height="60" />
## 📎 setup 
./Backend.README.md
## 🔩 stack used
<img src="https://logos-world.net/wp-content/uploads/2021/02/Docker-Logo-700x394.png" width="120" height="70" /><img src="https://pngimg.com/uploads/mysql/mysql_PNG6.png" width="100" height="60" /><img src="https://zolmeister.com/assets/images/jwt_logo.png" width="110" height="60" /><img src="https://brandslogos.com/wp-content/uploads/images/react-logo.png" width="60" height="60" /><img src="https://brandslogos.com/wp-content/uploads/images/python-logo.png" width="60" height="60" /><img src="https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png" width="130" height="60" />

## 📲 show user experience
![bookstore1](https://github.com/lucaimbalzano/bookstore/assets/45575898/97c8b93f-79eb-46e9-99de-45189fe41ba9)
![bookstore2](https://github.com/lucaimbalzano/bookstore/assets/45575898/a3ed55ce-b476-47d8-835e-39dad1949955)
![bookstore4](https://github.com/lucaimbalzano/bookstore/assets/45575898/e2c1e187-2055-4719-acf0-7d03bdb90beb)
![booksotre7](https://github.com/lucaimbalzano/bookstore/assets/45575898/a7cb393f-fca9-449f-983b-0d65fe210387)
![bookstore6](https://github.com/lucaimbalzano/bookstore/assets/45575898/30d1697c-4060-406a-a87a-d2a612850877)
![bookstore8](https://github.com/lucaimbalzano/bookstore/assets/45575898/8e89cf1b-f644-4fa4-b204-12547b5b7db9)
![bookstore9](https://github.com/lucaimbalzano/bookstore/assets/45575898/7707ef4d-62d7-494e-a23b-f05bde0e26b5)
![bookstore10](https://github.com/lucaimbalzano/bookstore/assets/45575898/29ff437b-a760-48ba-aafb-95b361b39f42)


## 🎯 Coding Challenge

Task: Book Management API with User Sessions

Objective:
Create a RESTful API using Python for managing books in a library system. The API should allow users to perform CRUD (Create, Read, Update, Delete) operations on books. Additionally, implement user sessions to provide a personalized experience.

Requirements:
```
    • Use Python with a web framework such as Flask or Django or Fastapi.
    • Use a database to store the book information (e.g., MySQL, PostgreSQL, SQLite).
```
Implement the following endpoints:
```
    • GET /books: Retrieve a list of all books.
    • GET /books/{id}: Retrieve a specific book by its ID.
    • POST /books: Create a new book (requires user authentication).
    • PUT /books/{id}: Update an existing book by its ID (requires user authentication).
    • DELETE /books/{id}: Delete a book by its ID (requires user authentication).
```
Each book should have the following properties:
```
    • id: Unique identifier for the book (auto-generated).
    • title: Title of the book.
    • author: Author of the book.
    • isbn: ISBN (International Standard Book Number) of the book.
    • publicationYear: Year of publication.
```
Implement user registration and login functionality:
```
    • POST /register: Allow users to create a new account.
    • POST /login: Allow users to log in and receive a session token.
    • POST /logout: Allow users to log out and invalidate their session token.
```
Use user sessions to personalize the experience:
```
    • Implement a favorites feature that allows authenticated users to mark books as favorites.
    • GET /favorites: Retrieve the list of books marked as favorites by the authenticated user.
    • POST /favorites/{bookId}: Add a book to the authenticated user's favorites.
    • DELETE /favorites/{bookId}: Remove a book from the authenticated user's favorites.
```
Implement proper error handling for scenarios such as invalid requests, resource not found, unauthorized access, etc.
Write unit tests to ensure the functionality of the API endpoints and user session management.
Provide a clear README file with instructions on how to set up and run the application.
Bonus Points:
```

    • Implement pagination for the GET /books endpoint.
    • Use JSON Web Tokens (JWT) for user authentication instead of session tokens.
    • Implement rate limiting to prevent abuse of the API.
    • Deploy the API to a cloud platform (e.g., AWS, Azure, Heroku).
```
Evaluation Criteria:

Code quality, readability, and adherence to best practices.
Proper implementation of CRUD operations and user session management.
Correct usage of Python, the chosen web framework, and database.
Error handling and edge case considerations.
Testing coverage and quality of unit tests.
Clear and concise documentation.
Submission:

Provide a link to a GitHub repository containing the source code.
Include a README file with setup instructions and any necessary documentation.
If deployed, provide a link to the live API.
Time Limit:

The candidate should submit the completed task within 3 days.
This updated task incorporates the requirement for using Python and adds user session management functionality. It assesses the candidate's ability to design and implement a RESTful API, work with databases, handle user authentication and sessions, and provide a personalized user experience. It also tests their proficiency in Python web development and their understanding of session management concepts.

Feel free to further customize the task based on your specific requirements and expectations.
