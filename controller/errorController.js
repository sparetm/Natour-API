const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}


const sendErrorProduction = (err, res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
            
      });
    } else {
        console.error('ERROR', err);
        res.status(500).json({
            status: 'error',
            message:'something went wrong !'
        });
    }
};

const sendErrorDevelopment = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack 
  });
}

// universal error handling middleware. 1st argument will be error
// types of error:-- invalid id, dublicate name, sending value more then the maximum value. 
module.exports = (err, req, res, next) => { 
    console.log(err.stack); // it shows where error happens
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; // i.e by default, if we have 500 status code then status(json message) will be 'error'.
     
    if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        sendErrorProduction(error, res);
    } else if(process.env.NODE_ENV === 'development'){
        sendErrorDevelopment(err, res);
    } 
};