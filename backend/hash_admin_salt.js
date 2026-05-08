import bcrypt from 'bcryptjs';

const salt = '.ku';
const password = 'admin';
const hash = await bcrypt.hash(password, salt);
console.log('Hash for admin with salt:', hash);
