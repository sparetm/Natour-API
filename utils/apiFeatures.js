//----------------------------------------------------------------//
//-----------------------------part-10----------------------------//
//----------------------------------------------------------------//


class APIFeatures {
    //all the query are in string format
    //changing query with 'this.query' & changing req.query with 'this.queryString'
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }



filter(){

        // 1.1) basic filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy) ------*/
        const queryObj = { ...this.queryString }; // making a copy of original query object
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // ignoring some fields during filtering.
        excludedFields.forEach(el => delete queryObj[el]); // not creating new array.


        // 1.2) advance filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy) ------*/
        let queryStr = JSON.stringify(queryObj);//converting to string
        /*before:- { difficulty: 'easy', duration: {gte: '5'} } */
        queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);//adding $ sigh
        /*after:- { difficulty: 'easy', duration: { $gte: '5'} } */
        queryStr = JSON.parse(queryStr);//converting back to object
        //let query =  Tour.find(queryStr); // it will return a query and later on we can manipulate it untill we await this find() method. Because after await query will execute and it will come back with the final matched document.
        this.query = this.query.find(queryStr);
    return this;
}



sort(){
    
        // 2) sorting
        /*------1) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=price) ------*/
        /*------2) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage)------*/
        /*------3) TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?sort=-price,-ratingsAverage)------*/
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

    return this;
}



limitFields(){

       // 3) Field limiting
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?fields=name,duration,price) ------*/
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); // including only these fields in the result
        } else {
            this.query = this.query.select('-__v'); // removing it by using '-'
        }

    return this;
}



paginate(){
    
        // 4) pagination
         /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?page=1&limit=10) ------*/
         const page = this.queryString.page * 1 || 1;
         const limit = this.queryString.limit * 1 || 100;
         const skip = ( page -1 ) * limit;
         this.query = this.query.skip(skip).limit(limit);
         
    return this;
}
}

module.exports = APIFeatures;