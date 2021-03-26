const mongoose = require('mongoose');

//----------------------------------------------------------------//
//------------------------------part-6----------------------------//
//----------------------------------------------------------------//

const tourSchema = new mongoose.Schema({ // 1) creating Schema

    name: {
        type: String,
        required: [true, 'A tour must have name'], // built in data validator. This is a validator. 2nd argument is error.
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal to 40 characters'],
        minlength: [10, 'A tour name must have more or equal to 10 characters']
       // validate: [validator.isAlpha, 'Tour name must only contain characters without spaces'] // to check only for characters without spaces.
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have group size']
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
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) { // this only works when new document created.
                return val < this.price;
            },
            message: 'Discount price i.e ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        //select: false // to hide it from end user
    },
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }

});

const Tour = mongoose.model('Tour', tourSchema); // 2) creating model


module.exports = Tour;






/*
const testTour = new Tour({ // 3) creating document
    name:"shubham",
    rating: 4.3,
    price: 984
});

testTour.save() // 4) save the document. it will returns a promise
    .then(doc => {console.log(doc)})//the final content of the document
    .catch(error => {console.log('we havw an error :- '+error)})
*/

