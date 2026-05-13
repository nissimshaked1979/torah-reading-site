import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: ['.next/**', '.tools/**', 'node_modules/**']
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
