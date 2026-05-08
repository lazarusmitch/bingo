import bcrypt from 'bcryptjs';

const password = 'admin';
const hash = await bcrypt.hash(password, 10);
console.log('Generated hash:', hash);
const isMatch = await bcrypt.compare(password, hash);
console.log('Compare result:', isMatch);
