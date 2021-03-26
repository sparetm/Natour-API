//----------------------------------------------------------------//
//-----------------------------part-10----------------------------//
//----------------------------------------------------------------//


class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }



filter(){

        // 1.1) basic filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy) ------*/

        const queryObj = { ...this.queryString }; 
        const excludedFields = ['page', 'sort', 'limit', 'fields']; 
        excludedFields.forEach(el => delete queryObj[el]); 


        // 1.2) advance filtering
        /*------TO TRIGGER = (GET) (127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy) ------*/

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);
        queryStr = JSON.parse(queryStr);
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
            this.query = this.query.select(fields); 
        } else {
            this.query = this.query.select('-__v'); 
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