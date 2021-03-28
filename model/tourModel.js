const mongoose = require('mongoose');

//----------------------------------------------------------------//
//------------------------------part-6----------------------------//
//----------------------------------------------------------------//

const tourSchema = new mongoose.Schema({ 

    name: {
        type: String,
        required: [true, 'A tour must have name'], 
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal to 40 characters'],
        minlength: [10, 'A tour name must have more or equal to 10 characters']
      
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above or equal to 1.0'],
        max: [5, 'Rating must be below or equal to 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have price']
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    startDates: [Date],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

const Tour = mongoose.model('Tour', tourSchema); 


module.exports = Tour;






