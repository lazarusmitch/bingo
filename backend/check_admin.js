import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const isMatch = await bcrypt.compare('admin', hash);
console.log('admin matches:', isMatch);
