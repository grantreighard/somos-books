# About

This project is a take home challenge for my interview process with Somos in January 2024.

The project is a book finder that loads in a finite set of data about books from a file in the back end and allows searching and favoriting.

# Setup

1. Ensure [node.js](https://nodejs.org/en) is installed.
2. Ensure [Yarn](https://yarnpkg.com/) is installed.
3. Clone the repository `git clone https://github.com/grantreighard/somos-books.git`
4. Change into the frontend directory `cd frontend/`
5. Install the modules `yarn install`
6. In a new terminal, change into the backend directory `cd backend/`
7. Install the modules `yarn install`
8. Unzip the file attached to the email submitting this project with the included password.
9. Place the .env files from the unzipped folder into the appropriate project directories: frontend -> frontend and backend -> backend.
10. In backend terminal, run the server `yarn start` or `yarn dev`
11. In the frontend terminal, run the webapp `yarn start`
12. Visit the [webapp](http://localhost:3000) in your browser

# Alternative

If you'd prefer to just review the code and view a live version, you can do so [here](https://books.grantreighard.com).

# Notes

- An .env file is required for both the front end and back end.
- Required values for frontend .env file: REACT_APP_SERVER_BASE_URL
- Required values for backend .env file: DB_URL, JSON_WEB_TOKEN_SECRET, JWT_ID
- Book data used in Node is from [GitHub](https://github.com/dudeonthehorse/datasets/blob/master/amazon.books.json) and has been cleaned up.
