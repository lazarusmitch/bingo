import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const isMatch = await bcrypt.compare('password123', hash);
console.log('password123 matches:', isMatch);
