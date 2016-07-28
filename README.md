# Graphs and Tracks

Rewrite of the original [Graphs and Tracks](https://github.com/davidtro/gt) educational app, using [Angular 2](https://angular.io/) and [Material Design](https://material.angular.io/).

## Build and run the beta version
- Download and install [Node v6+](https://nodejs.org/en/download/current/)
- Download and unzip the [latest version of the source code](https://github.com/snolflake/gt/archive/master.zip)
- Open the Node.js command line recently installed then:
	- browse to the source code directory
	- run the command `npm install` to download all the librarys and frameworks used (errors can be ignored)
	- run `npm start` to build the application and start a local webserver (this command shouldn't return any errors)
- In your browser navigate to http://localhost:8080 and the current WIP of the app should appear

## Motion Calculations
Mostly of the motion calculations are implemented in the [Motion Class](src/models/motion.ts). Some other parameters used in calculations can also be found under the [app settings](src/settings.ts).
