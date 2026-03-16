import mongoose from "mongoose";

async function connectToDB() {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB successfully.");
    })
    .catch((err) => {
      console.log("Database Error : " + err);
    });
}

export default connectToDB;
