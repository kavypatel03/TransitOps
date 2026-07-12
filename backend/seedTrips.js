const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trip = require('./models/Trip');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transitops');
        
        // Find some users with role driver
        const drivers = await User.find({ role: { $in: ['driver', 'Driver'] } });
        if (drivers.length === 0) {
            console.log("No drivers found in User collection.");
            process.exit(1);
        }

        // Find some vehicles
        const vehicles = await Vehicle.find();
        if (vehicles.length === 0) {
            console.log("No vehicles found.");
            process.exit(1);
        }

        // Delete existing trips to reset
        await Trip.deleteMany({});

        // Create new completed trips
        const newTrips = [
            {
                source: 'Mumbai Hub',
                destination: 'Delhi Hub',
                vehicle: vehicles[0]._id,
                driver: drivers[0]._id,
                cargoWeight: 14500,
                plannedDistance: 1400,
                status: 'Completed'
            },
            {
                source: 'Bangalore Hub',
                destination: 'Chennai Hub',
                vehicle: vehicles[1%vehicles.length]._id,
                driver: drivers[0]._id,
                cargoWeight: 8000,
                plannedDistance: 350,
                status: 'Completed'
            },
            {
                source: 'Hyderabad Hub',
                destination: 'Pune Hub',
                vehicle: vehicles[2%vehicles.length]._id,
                driver: drivers.length > 1 ? drivers[1]._id : drivers[0]._id,
                cargoWeight: 12000,
                plannedDistance: 560,
                status: 'Completed'
            }
        ];

        await Trip.insertMany(newTrips);
        console.log("Successfully inserted real completed trips for real users!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
