const Tour = require('./../model/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//------------------------------tourRoute-handeler----------------------------//


//----------------------------------------------------------------//
//-------------------------part-7 and part-9----------------------//
//----------------------------------------------------------------//


// 5) Aliasing
/*-------------------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours/top-5-cheap) ---------------*/
exports.aliasTopTours = (req, res, next) => {
req.query.limit = '5';
req.query.sort = '-ratingsAverage,price';
req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
next();
};


/*-------------------TO GET ALL THE TOURS DETAILS---------------*/
/*-------------------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours) ---------------*/

exports.getAllTours = catchAsync(async (req, res, next) => {
   
        //executing query
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
        const tours = await features.query;
        
        //sending response
        res.status(200).json({
            status:'success',
            results: tours.length,
            requestedAt: req.requestTime,
            data: {
                tour: tours
            }
        });
});



/*-------------------TO CREATE NEW TOURS---------------------*/
/*-------------------TO TRIGGER = (POST) (BODY) (127.0.0.1:3000/api/v1/tours) ---------------*/



exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
            tour: newTour
        } 
});
});



/*-------------------TO GET A SPECIFIC TOUR DETAILS---------------------*/
/*-------------------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours/:id) ---------------*/

exports.getTour = catchAsync(async (req, res, next) => { 
    const tour = await Tour.findById(req.params.id); // it will give an object. it is an alternative of Tour.findOne({_id: req.params.id})

    if(!tour){ 
        return next(new AppError('no tour found with this ID', 404));
    }


    res.status(200).json({
        status:'success',
        requestedAt: req.requestTime,
        data: {
            tour: tour
        }
    });
});





/*-------------------TO UPDATE A SPECIFIC TOUR DETAILS---------------------*/
/*-------------------TO TRIGGER = (PATCH) (BODY) (127.0.0.1:3000/api/v1/tours/:id) ---------------*/

exports.updateTour = catchAsync(async (req, res, next) => {
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, 
        runValidators: true 
    });


    if(!tour){
        return next(new AppError('no tour found with this ID', 404));
    }


  res.status(201).json({
      status:'success',
      requestedAt: req.requestTime,
      data: {
          tour: updated 
      }
})
});




/*-------------------TO DELETE A TOUR---------------------*/
/*-------------------TO TRIGGER = (Delete) (127.0.0.1:3000/api/v1/tours/:id) ---------------*/

exports.deleteTour = catchAsync(async (req, res, next) => {
   const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour){ 
        return next(new AppError('no tour found with this ID', 404));
    }

    res.status(204).json({
        status:'success',
        requestedAt: req.requestTime,
        data: {
            tour: []
        }
})
});

//----------------------------------------------------------------//
//-----------------------------part-11----------------------------//
//----------------------------------------------------------------//


exports.getTourStats = catchAsync(async (req, res, next) => { 
    const stats = await Tour.aggregate([

        {
            $match: {ratingsAverage: { $gte: 4.5}} 
        },

        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity' },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'}
            }
        },

        {
            $sort: { avgPrice: 1 } 
        }
        
    ]);

    res.status(200).json({
        status: 'success',
        requestTime: req.reqTime,
        data: {
            stats
        }
    });
});





exports.getMonthlyPlan = catchAsync(async (req, res, next) => { 
    const year = req.params.year * 1; 
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates' 
        },
        {
            $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } }
        },
        {
            $group: { _id: { $month: '$startDates' }, numTourStarts: { $sum: 1}, tours:{ $push: '$name' } } 
        },
        {
            $addFields: { month: '$_id' } 
        },
        {
            $project: { _id: 0 } 
        },
        {
            $sort: { numTourStarts: -1 } 
        },
        {
            $limit: 12 
        }
    ]);
    res.status(200).json({
        status: 'success',
        requestTime: req.reqTime,
        data: {
            plan
        }
    });
});
