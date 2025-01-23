const bcrypt = require('bcryptjs');

const password = 'admin1234'; // Replace with your desired password

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Hashed password:', hash);
  })
  .catch(err => {
    console.error(err);
  });
