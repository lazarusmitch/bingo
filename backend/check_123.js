import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const isMatch = await bcrypt.compare('123456', hash);
console.log('123456 matches:', isMatch);
