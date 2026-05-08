import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const isMatch = await bcrypt.compare('bobsbingo', hash);
console.log('bobsbingo matches:', isMatch);
