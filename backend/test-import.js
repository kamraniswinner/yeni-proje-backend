// test-import.js
import path from 'path';
console.log('Current directory:', path.resolve());

import User from './models/User.js';
console.log('User model imported:', User);
