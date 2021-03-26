const dotenv = require('dotenv'); //necessary for using environment variable
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
//console.log(process.env);//it print all environment variable in console
const app = require('./app'); //including to access app.listen

//----------------------------------------------------------------//
//------------------------------part-5----------------------------//
//----------------------------------------------------------------//


const DB = process.env.DATABASE_HOSTED.replace('<DATABASE_PASSWORD>', process.env.DATABASE_PASSWORD); //connection to Atlas (remotely)
const connectDB = async () => {
    try{
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('Database Connection Successful !');
    } catch(error){
        console.log("mongodb not connected");
        console.error(error.message);
        process.exit(1);
    }
};
connectDB();


/* 
const DB = process.env.DATABASE_LOCAL.replace('<DATABASE_NAME>', process.env.DATABASE_NAME); //connection to local database
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('Database Connection Successful !'));
*/



//----------------------------------------------------------------//
//------------------------------part-4----------------------------//
//----------------------------------------------------------------//

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is started on port:${port}`);
})