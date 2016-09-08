module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "parser": "babel-eslint",
    "react/react-in-jsx-scope": 0,
    "rules": {
    	"max-len": [1, 200, 2, {ignoreComments: true}],
    },
};
