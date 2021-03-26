const express = require("express");
const catchAsync = require("../utils/catchAsync.js");
const tourController = require('./../controller/tourController.js'); //routehandler for tour
//const { route } = require("./userRoute.js");

const router = express.Router();


//router.param('id', tourController.checkID); //1st argument is parameter, 2nd(req, res, next) & 3rd(val) argument are (req, res, next, val) 

router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours)


router
    .route('/tour-stats')
    .get(tourController.getTourStats);


router
    .route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);


router
    .route('/')
    .get(tourController.getAllTours)
    //.get(catchAsync(tourController.getAllTours)) //WE CAN ALSO USE LIKE THIS AFTER IMPORTING---- ./../utils/catchAsync
    .post(tourController.createTour);
    /*.post(tourController.checkBody,tourController.createTour);*/

router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;