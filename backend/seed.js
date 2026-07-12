const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const ExpenseLog = require('./models/ExpenseLog');
const MaintenanceLog = require('./models/MaintenanceLog');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Vehicle.deleteMany();
        await Driver.deleteMany();
        await Trip.deleteMany();
        await ExpenseLog.deleteMany();
        await MaintenanceLog.deleteMany();
        
        console.log('Cleared existing data.');

        // 1. Create Vehicles
        const vehicles = await Vehicle.insertMany([
            { registrationNumber: 'ABC-1234', modelName: 'Volvo FH16', type: 'Semi-Trailer', maxLoadCapacity: 40000, odometer: 12450, acquisitionCost: 145000, status: 'Available' },
            { registrationNumber: 'XYZ-9876', modelName: 'Mercedes Actros', type: 'Flatbed', maxLoadCapacity: 32000, odometer: 84100, acquisitionCost: 128500, status: 'On Trip' },
            { registrationNumber: 'LMN-5544', modelName: 'Scania R500', type: 'Refrigerated', maxLoadCapacity: 28000, odometer: 156000, acquisitionCost: 115000, status: 'In Shop' },
            { registrationNumber: 'KRT-8822', modelName: 'Isuzu Forward', type: 'Box Truck', maxLoadCapacity: 12000, odometer: 45200, acquisitionCost: 65000, status: 'Available' },
            { registrationNumber: 'DEF-4433', modelName: 'DAF XF', type: 'Tanker', maxLoadCapacity: 35000, odometer: 210500, acquisitionCost: 98000, status: 'Retired' }
        ]);

        // 2. Create Drivers
        const drivers = await Driver.insertMany([
            { name: 'Marcus Miller', licenseNumber: 'DL-8801', licenseCategory: 'Class A', licenseExpiryDate: new Date('2028-05-12'), contactNumber: '5551234567', safetyScore: 98, status: 'On Trip' },
            { name: 'Sarah Jenkins', licenseNumber: 'DL-8802', licenseCategory: 'Class A', licenseExpiryDate: new Date('2027-11-20'), contactNumber: '5559876543', safetyScore: 95, status: 'Available' },
            { name: 'David Chen', licenseNumber: 'DL-8803', licenseCategory: 'Class B', licenseExpiryDate: new Date('2029-01-15'), contactNumber: '5554567890', safetyScore: 92, status: 'On Trip' },
            { name: 'John Doe', licenseNumber: 'DL-8804', licenseCategory: 'Class A', licenseExpiryDate: new Date('2026-08-30'), contactNumber: '5557890123', safetyScore: 88, status: 'Available' },
            { name: 'Elena Rodriguez', licenseNumber: 'DL-8805', licenseCategory: 'Class C', licenseExpiryDate: new Date('2028-12-05'), contactNumber: '5553210987', safetyScore: 96, status: 'Off Duty' }
        ]);

        // 3. Create Trips
        const trips = await Trip.insertMany([
            { source: 'Chicago, IL', destination: 'Detroit, MI', vehicle: vehicles[0]._id, driver: drivers[0]._id, cargoWeight: 38000, plannedDistance: 280, status: 'Dispatched' },
            { source: 'Austin, TX', destination: 'Houston, TX', vehicle: vehicles[1]._id, driver: drivers[1]._id, cargoWeight: 25000, plannedDistance: 165, status: 'Completed' },
            { source: 'Phoenix, AZ', destination: 'Las Vegas, NV', vehicle: vehicles[2]._id, driver: drivers[2]._id, cargoWeight: 27000, plannedDistance: 300, status: 'Dispatched' },
            { source: 'Atlanta, GA', destination: 'Miami, FL', vehicle: vehicles[3]._id, driver: drivers[3]._id, cargoWeight: 10000, plannedDistance: 660, status: 'Draft' },
            { source: 'Seattle, WA', destination: 'Portland, OR', vehicle: vehicles[0]._id, driver: drivers[4]._id, cargoWeight: 39000, plannedDistance: 175, status: 'Draft' }
        ]);

        // 4. Create Expense Logs
        const expenses = await ExpenseLog.insertMany([
            { vehicle: vehicles[0]._id, type: 'Fuel', liters: 120, cost: 450, date: new Date('2024-05-10') },
            { vehicle: vehicles[1]._id, type: 'Toll', cost: 85, date: new Date('2024-05-11') },
            { vehicle: vehicles[2]._id, type: 'Other', cost: 120, date: new Date('2024-05-12') },
            { vehicle: vehicles[3]._id, type: 'Fuel', liters: 180, cost: 650, date: new Date('2024-05-13') },
            { vehicle: vehicles[0]._id, type: 'Other', cost: 300, date: new Date('2024-05-14') }
        ]);

        // 5. Create Maintenance Logs
        const maintenance = await MaintenanceLog.insertMany([
            { vehicle: vehicles[0]._id, cost: 250, date: new Date('2024-04-15'), description: 'Oil change and filter replacement', status: 'Closed' },
            { vehicle: vehicles[2]._id, cost: 1200, date: new Date('2024-05-01'), description: 'Refrigeration unit compressor replacement', status: 'Active' },
            { vehicle: vehicles[1]._id, cost: 800, date: new Date('2024-04-20'), description: 'Replaced 4 rear tires', status: 'Closed' },
            { vehicle: vehicles[3]._id, cost: 150, date: new Date('2024-05-10'), description: 'Adjusted brake pads', status: 'Active' }
        ]);

        console.log('Dummy data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
