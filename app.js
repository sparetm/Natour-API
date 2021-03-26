//----------------------------------------------------------------//
//------------------------------part-1----------------------------//
//----------------------------------------------------------------//

const express = require("express");
const morgan = require("morgan");
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController')
const tourRouter = require('./route/tourRoute.js');
const userRouter = require('./route/userRoute.js');

if(process.env.NODE_ENV === 'development'){ 
      app.use(morgan('dev'));
}

app.use(express.json());


// to access static files like pics,html etc. we can access by http://127.0.0.1:3000/index.html
app.use(express.static(`${__dirname}/data`)); 


app.use((req, res, next) => { 
    req.requestTime = new Date().toISOString();
    next();
    })

//----------------------------------------------------------------//
//------------------------------part-2----------------------------//
//----------------------------------------------------------------//

/*
 * importing tourRouteHandler in ./route/tourRoute.js' from ./controller/tourController.js'.
 * importing userRouteHandler in ./route/userRoute.js' from ./controller/userController.js'.
 */

//----------------------------------------------------------------//
//------------------------------part-3----------------------------//
//----------------------------------------------------------------//

//-----route-----//

app.use('/api/v1/tours', tourRouter); 
app.use('/api/v1/users', userRouter); 


//----------------------------------------------------------------//
//------------------------------part-13----------------------------//
//----------------------------------------------------------------//

app.all('*', (req, res, next) => {
      next(new AppError(`can't find ${req.originalUrl} on this server !`, 404)); 
})

app.use(globalErrorHandler);

module.exports = app;


/*
 * including express and using middleware ( part 1 )
 * defining route handeler ( part 2 )
 * defining route ( part 3 )
       * defining two folder for userRouter and tourRouter in which routehandler is imported.
 * starting server ( part 4 )
       * we have shift this into a separate file server.js by importing app from app.js in server.js file
       * then we have define env variables in which we define our port.
       * based on production or development we can run a specific code using:- if(process.env.NODE_ENV === 'development'){}
 * now we are going to install mongoDB.
 * connecting mongoDB to our express application using mongoose ( part 5 )
 * creating tourModel in separate folder model. then import it in tourController.js ( part 6 )
 * crud operation in tourController using mongoose ( part 7 )
 * creating a script to delete and to import all the data from a file to the mongoDB database(remotely) ( part 8 )
 * implementing filtering, sorting, limitingFields, pagination features in tourController.js ( part 9 )
 * implementing a APIFeature class in folder util and transfering all the Api-features into that class ( part 10 )
 * implementing aggrigation pipeline in tourController ( part 11 )
 * ??????????????????????????????????????????????????? ( part 12 )
 * implementing univarsal error handler. we have put our globalErrorHandler in controller folder ( part 13 )
 * implementing an app error class in utils folder ( part 14 )
 * implementing a better error handling function catchAsync inside a utils folder 
 */ 