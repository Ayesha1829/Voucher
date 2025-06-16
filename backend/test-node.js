console.log('Node.js is working!');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Test if we can require express
try {
  const express = require('express');
  console.log('✅ Express is available');
  
  const app = express();
  console.log('✅ Express app created');
  
  const PORT = 5000;
  const server = app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  });
  
} catch (error) {
  console.log('❌ Error:', error.message);
  process.exit(1);
}
