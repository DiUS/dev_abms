module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "es6": true,
    "node": true
  },
  "root": true,
  "rules": {
    "max-len": ["error", 120],
    "no-trailing-spaces": ["error", { "skipBlankLines": true }],
    "semi": ["warn", "never"]
  }
}
