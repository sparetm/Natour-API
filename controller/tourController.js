const Tour = require('./../model/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//------------------------------tourRoute-handeler----------------------------//

//const app = require("../app");

/*
exports.checkID = (req, res, next, val) => {
    console.log(`tour id is ${val}`)
    const id = req.params.id * 1;
    if(id > tours.length){
        return res.status(404).json({message:'invalid ID'})
    }
    next();
}


exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
       return res.status(404).json({status:'fail', message:'name and price is not present'})
    }
    next();
}
*/

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
    /*  
        // 1.1) basic filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy) ------*/
        /*
        const queryObj = { ...req.query }; // making a copy of original query object
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // ignoring some fields during filtering.
        excludedFields.forEach(el => delete queryObj[el]); // not creating new array.

*/
        // 1.2) advance filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy) ------*/
        /*
        let queryStr = JSON.stringify(queryObj);//converting to string
        /*before:- { difficulty: 'easy', duration: {gte: '5'} } */
        /*
        queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);//adding $ sigh
        */
        /*after:- { difficulty: 'easy', duration: { $gte: '5'} } */
        /*
        queryStr = JSON.parse(queryStr);//converting back to object
        let query =  Tour.find(queryStr); // it will return a query and later on we can manipulate it untill we await this find() method. Because after await query will execute and it will come back with the final matched document.
        */

        // 2) sorting
        /*------1) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=price) ------*/
        /*------2) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage)------*/
        /*------3) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage)------*/
        /*
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        */

        // 3) Field limiting
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?fields=name,duration,price) ------*/
        /*
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields); // including only these fields in the result
        } else {
            query = query.select('-__v'); // removing it by using '-'
        }
        */

        // 4) pagination
         /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?page=1&limit=10) ------*/
         /*
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = ( page -1 ) * limit;
        query = query.skip(skip).limit(limit);
        
        if(req.query.page){
            const numTours = await Tour.countDocuments();
            if(skip >= numTours) throw new Error('This page does not exist !');
        }
        */

        //query.sort().select().skip().limit()
        //executing query
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        //const tours = await query;
        const tours = await features.query;
        
        //we are not using if(!tour) error here

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



/*
exports.getAllTours = async (req, res) => {
    try{
        const tours = await Tour.find(); 
        res.status(200).json({
            status:'success',
            results: tours.length,
            requestedAt: req.requestTime,
            data: {
                tour: tours
            }
        });
    } catch(err){
        res.status(404).json({
            status:'fail',
            message:'invalid request !'
    });
    }
};
*/


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

    if(!tour){ //if we use invalid ID.
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
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { //1st parameter is the id which you want to update & 2nd parameter is the new data.
        new: true, // it will return newly created document
        runValidators: true // after updating it will re-validate according to Schema.
    });


    if(!tour){ //if we use invalid ID.
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
/*//previous codes
exports.deleteTour = async (req, res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id);
      res.status(204).json({
          status:'success',
          requestedAt: req.requestTime,
          data: {
              tour: []
          }
  })
    } catch(err){
      res.status(404).json({
          status:'fail',
          message:'invalid request !'
  });
    }
};
*/

exports.deleteTour = catchAsync(async (req, res, next) => {
   const tour = await Tour.findByIdAndDelete(req.params.id);

    if(!tour){ //if we use invalid ID.
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


exports.getTourStats = catchAsync(async (req, res, next) => { // aggregation part 1
    const stats = await Tour.aggregate([

        {
            $match: {ratingsAverage: { $gte: 4.5}} // we can have as many match stages as we want in our pipeline.
        },

        {
            $group: {
                _id: { $toUpper: '$difficulty' }, // want to group using reference 'difficulty'
                numTours: { $sum: 1},
                numRatings: { $sum: '$ratingsQuantity' },
                avgRatings: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price'},
                minPrice: { $min: '$price'},
                maxPrice: { $max: '$price'}
            }
        },

        {
            $sort: { avgPrice: 1 } // 1 for accending
        }
        /*
        {
            $match: { _id: { $ne: 'easy'} } //excluding easy one
        }
        */
    ]);

    res.status(200).json({
        status: 'success',
        requestTime: req.reqTime,
        data: {
            stats
        }
    });
});





exports.getMonthlyPlan = catchAsync(async (req, res, next) => { // aggregation part 2
    const year = req.params.year * 1; // 2021
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates' //one document for each of the date
        },
        {
            $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } }
        },
        {
            $group: { _id: { $month: '$startDates' }, numTourStarts: { $sum: 1}, tours:{ $push: '$name' } } // creating array of tour's name by using push.
        },
        {
            $addFields: { month: '$_id' } // adding field 'month' with the value as same as id.
        },
        {
            $project: { _id: 0 } // show or hide the field '_id'
        },
        {
            $sort: { numTourStarts: -1 } // descending by using '-1'
        },
        {
            $limit: 12 // '12' is the no. of results
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
