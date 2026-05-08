import bcrypt from 'bcryptjs';

const hash = '.kuGkDUvKdDau4VicZSEt1pW1ObX1Dspya';

const passwords = ['admin', 'password', '123456', 'bingo'];

for (const pwd of passwords) {
  const isMatch = await bcrypt.compare(pwd, hash);
  if (isMatch) {
    console.log('Password is: ' + pwd);
    break;
  }
}
