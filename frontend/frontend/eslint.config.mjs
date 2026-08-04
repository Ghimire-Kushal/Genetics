import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "tsconfig.tsbuildinfo"],
  },
  ...nextVitals,
];

export default eslintConfig;
