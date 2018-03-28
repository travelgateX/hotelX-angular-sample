# XML Travelgate B2B

[XML Travelgate B2B](https://xtg-b2b.firebaseapp.com/) platform for business to business.

## Getting Started

### Prerequisites

You need to install [NodeJS](https://nodejs.org/es/). Run `npm install -g @angular/cli` to install [Angular CLI](https://cli.angular.io/).

### Installing

Install all dependencies from the project using [Yarn](https://yarnpkg.com/lang/en/) or [NPM](https://xtg-b2b.firebaseapp.com/):

Using yarn:
```
yarn install
```

Using npm:
```
npm install
```

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io/1.0/index.html).

## Running end to end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/#/).

## Deployment

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Run `ng serve` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

This project works with an [Express.js](http://expressjs.com/es/) server through NodeJS. First you must build the `dist/` folder with `npm run build` or `npm run build-w` for watching changes. Run `npm run server` to deploy de server with port 8080. Visit `http:localhost:8080` to see de application.

Here there is a list of the most common commands:

```
"build": "ng build -pr false",
"build-w": "ng build -w -pr false",
"build-prod": "ng build --prod",
"build-prod-w": "ng build --prod -w",
"server": "node server/server.js",
"server-prod": "NODE_ENV=prod node server/server.js"
```

## Built With

### Firebase
#### Google Functions
[Google Cloud Functions](https://firebase.google.com/docs/functions/)

To see functions log type `firebase functions:log`. Youo can see more at [https://firebase.google.com/docs/functions/writing-and-viewing-logs](https://firebase.google.com/docs/functions/writing-and-viewing-logs)



* [Request](https://www.npmjs.com/package/request) - Dependency for making requests
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
