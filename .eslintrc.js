module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  globals:{
    FUNFinder
  },
  extends: ["plugin:vue/essential", "standard", "@vue/typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
