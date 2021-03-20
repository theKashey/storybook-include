import { readFileSync } from 'fs';
import { join } from 'path';

import { transform } from '@babel/core';

const FIXTURE_PATH = join(__dirname, '__fixtures__/babel');

const testPlugin = {
  story: (code: string, filename: string) => {
    const result = transform(code, {
      filename,
      presets: ['@babel/preset-react'],
      plugins: [require.resolve('../src/babel')],
    });

    return result!.code!.split(__dirname).join('@');
  },
};

describe('babel', () => {
  Object.keys(testPlugin).forEach((folderName) => {
    const actualFile = join(FIXTURE_PATH, folderName, 'actual.js');
    const actual = readFileSync(actualFile, 'utf8');
    const expected = readFileSync(join(FIXTURE_PATH, folderName, 'expected.js'), 'utf8');

    it(`works with ${folderName}`, () => {
      const result = (testPlugin as any)[folderName](actual, actualFile);
      expect(result.trim()).toBe(expected.trim());
    });
  });
});
