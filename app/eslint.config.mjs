import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// Flat ESLint config for TypeScript in src/ and tests/.
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
);
