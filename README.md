# MealPlan

This is a simple Alexa skill, still very much in development, that is meant to map user "meals" to grocery items automatically added to an Alexa shopping list.

It doesn't do that yet.

Instead, all it does so far is run tests.

## Setup

At the moment, this is a standard NodeJS application, built with TypeScript.  It doesn't do much yet.  Therefore, it comes with an easy setup:
```
npm install
```

## To Test

This application uses a customized test runner.  Not because there aren't other open-source test runners available.  I wrote my own test runner to better understand the inputs, outputs, and behaviors of the Alexa/Lamdba relationship.  

And hey, I get test coverage out of it.  Can't be a bad thing, right?

Run the following command to see the tests run: 
```
npm test
```

If you have any failing tests, the runner will let you know.  If you'd like to compare the expected output against the output received, you can run the following:
```
npm run test-debug
```