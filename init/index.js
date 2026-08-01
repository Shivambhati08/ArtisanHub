const mongoose = require("mongoose");
const initdata = require("./data.js");
const Service = require("../models/service.js"); 
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const MONGO_URL = "mongodb+srv://shivambhati08:shivam0812@cluster0.b2fceae.mongodb.net/?appName=Cluster0";
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};
 
// const initdb  = async ()=>{
//     await Service.deleteMany({}); 
//     initdata.data = initdata.data.map((obj)=>({...obj, owner: "6a2ee4fad06e30fa6b9e768c"}))
//     await Service.insertMany(initdata.data);
//     console.log("Database initialized");
// };

// initdb();
const initDB = async () => {
    await Service.deleteMany({});

    const ownerId = "6a6cd35b1136a8f966c56046"; // Existing User _id
    const ownerContact = "9876543210" 

    const services = initdata.data.map((obj) => ({
        ...obj,
        owner: ownerId,
        Contact_No : ownerContact,
    }));

    await Service.insertMany(services);
    console.log("Database initialized");
};

initDB();