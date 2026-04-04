const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'users.json');

// Initialize users.json if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
  console.log("✅ Created users.json database.");
} else {
  console.log("✅ Connected to users.json database.");
}

// Helper to reliably read and write JSON data
function readDB() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data || '[]');
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Polyfill the exact mysql2 .promise().query() API so auth.js never has to change
const db = {
  promise: () => ({
    query: (sql, params = []) => {
      return new Promise((resolve) => {
        const users = readDB();
        const queryStr = sql.trim().toUpperCase();

        if (queryStr.startsWith('SELECT')) {
          // "SELECT * FROM users WHERE username = ?" => params is [username]
          const user = users.find(u => u.username === params[0]);
          // Return nested array: result[0] will be 'user' inside auth.js
          resolve([user ? [user] : []]); 
        } 
        else if (queryStr.startsWith('INSERT')) {
          // "INSERT INTO users (username, password) VALUES (?, ?)" => params is [username, password]
          const newUser = { id: users.length + 1, username: params[0], password: params[1] };
          users.push(newUser);
          writeDB(users);
          resolve([{ insertId: newUser.id, affectedRows: 1 }]);
        } 
        else if (queryStr.startsWith('UPDATE')) {
          // "UPDATE users SET password = ? WHERE username = ?" => params is [newPassword, username]
          const user = users.find(u => u.username === params[1]); 
          if (user) {
            user.password = params[0];
            writeDB(users);
            resolve([{ affectedRows: 1 }]);
          } else {
            resolve([{ affectedRows: 0 }]);
          }
        }
      });
    }
  })
};

module.exports = db;