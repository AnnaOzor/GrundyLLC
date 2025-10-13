import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://grundyllc:08139312776@grundyllc.2jwwowe.mongodb.net/GrundyLLC').then(()=>console.log("DB Connected"));
}