module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
    },
    "ecmaFeatures": {
        "jsx": true,
    },
    "extends": [
        "airbnb",
        "eslint-config-airbnb/rules/react",
    ],
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "parser": "babel-eslint",
    "rules": {
    	"max-len": [1, 200, 2, {ignoreComments: true}],
        "react/no-find-dom-node": 0,
        "no-underscore-dangle": 0,
    },
};
