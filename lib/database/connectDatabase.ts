import mongoose from 'mongoose';

let isConnected: boolean=false;

export const connectDatabase = async () => {
    mongoose.set('strictQuery',true);
    const mongoDbUrl = process.env.NEXT_PUBLIC_MONGODB_URL;

    if(!mongoDbUrl){
        return console.log('MongoDB URI is missing');
    }

    if(isConnected){
        return console.log('Database is already connected');
    }

    try {

        await mongoose.connect(mongoDbUrl,{
            dbName:'Project 0'
        }).then(()=>{console.log("db connection successfully established");
        isConnected=true;})
        .catch((error)=>{
            console.error(error);
            console.log("DB connection failed");
            process.exit(1);
        })
    } catch (error) {
     
    }

}