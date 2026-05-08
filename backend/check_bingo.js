import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const isMatch = await bcrypt.compare('bingo', hash);
console.log('bingo matches:', isMatch);
