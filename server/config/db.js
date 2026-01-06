const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const url=
    "mongodb+srv://Charan:TbApYMe2Cy6.qfi@cluster0.3wi3908.mongodb.net/?appName=Cluster0"
    const response = await mongoose.connect(url);
    if (response) {
      console.log("MongoDb connection is successfull");
    }
  } catch (error) {
    console.log("MongoDB connection error ", error);
    process.exit(1);
  }
};

module.exports = connectDB;