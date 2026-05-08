import bcrypt from 'bcryptjs';

const saltRounds = 10;
const password = 'admin';
const hash = await bcrypt.hash(password, saltRounds);
console.log('Hash for admin:', hash);
