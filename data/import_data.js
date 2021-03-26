
//----------------------------------------------------------------//
//------------------------------part-8----------------------------//
//----------------------------------------------------------------//


const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const Tour = require(`${__dirname}/../model/tourModel`);


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tour.json`, 'utf8'));


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



const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted !');
    } catch(err){
        console.log(err);
    }
    process.exit(); // to stop the application
};

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully uploaded !');
    } catch(err){
        console.log(err);
    }
    process.exit(); // to stop the application
};

if(process.argv[2] === '--import'){ // Type in Terminal: - node data/import_data.js --import
    importData();
} else if(process.argv[2] === '--delete'){ // Type in Terminal: - node data/import_data.js --delete
    deleteData();
} 

//console.log(process.argv); // to view the array in terminal.