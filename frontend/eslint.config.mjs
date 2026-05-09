import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "frontend/**",
      "backend/**",
      "tsconfig.tsbuildinfo",
    ],
  },
  ...nextVitals,
];

export default eslintConfig;
