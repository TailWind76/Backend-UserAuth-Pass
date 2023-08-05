// Step 1: Install required dependencies
// npm install express passport passport-local express-session

// Step 2: Require necessary modules
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

// Step 3: Create Express app
const app = express();

// Step 4: Configure Passport with a local strategy for authentication
passport.use(new LocalStrategy((username, password, done) => {
  // Replace this with your actual user authentication logic
  if (username === 'user' && password === 'password') {
    return done(null, { id: 1, username: 'user' });
  } else {
    return done(null, false, { message: 'Invalid credentials' });
  }
}));

// Step 5: Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Replace this with your actual user retrieval logic
  const user = { id: 1, username: 'user' };
  done(null, user);
});

// Step 6: Configure Express to use session and Passport
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Step 7: Create login and logout routes
app.post('/login', passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' }));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Step 8: Create a middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Step 9: Protected route for dashboard accessible only after login
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.send('Welcome to your dashboard!');
});

// Step 10: Login page and home page routes
app.get('/login', (req, res) => {
  res.send('Please login');
});

app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

// Step 11: Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
