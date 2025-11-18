import { registerAs } from '@nestjs/config';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default registerAs('jwt', () => {
  const prodKeysPath = join(__dirname, '../../keys'); // dist
  const devKeysPath = join(__dirname, '../../../keys'); // src

  const keysPath = existsSync(join(prodKeysPath, 'private.pem'))
    ? prodKeysPath
    : devKeysPath;

  return {
    privateKey: readFileSync(join(keysPath, 'private.pem'), 'utf8'),
    publicKey: readFileSync(join(keysPath, 'public.pem'), 'utf8'),
  };
});
