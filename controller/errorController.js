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


module.exports = (err, req, res, next) => { 
    console.log(err.stack); 
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'; 
     
    if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        sendErrorProduction(error, res);
    } else if(process.env.NODE_ENV === 'development'){
        sendErrorDevelopment(err, res);
    } 
};