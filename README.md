# qa-cypress

Welcome to qa-cypress-goal

The purpose of this repo is to test [Goal](https://goal-dev.mdx.ac.uk) using automation QA tool called cypress


## Getting started
To get started with this project, first clone the repository to your local machine. Then, navigate to the project directory and run the following command to install the necessary dependencies:
```
npm install
```

## starting cypress
To start Cypress, run the following command in the root directory of the project:
```
npx cypress open
```

## Test Cases
All of the test cases for this project can be found in the following directory:
```
/cypress/e2e/goal.cy.js
```

## Configuration
In order to run the test cases successfully, you will need to create a file in the root directory of the project called cypress.env.js. This file should contain a JSON object with the following fields:
```
{
    "STAFF_USERNAME": "",
    "STAFF_PASSWORD": "",
    "STAFF_EMAIL": ""
}
```


You will need to fill in the empty strings with the appropriate values for your test environment.

That's it! You should now be ready to run the test cases using Cypress. Happy testing!