import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://mongodb:27017/checklist_db';

const users = [
    { name: 'Admin', email: 'admin@company.com', password: 'Admin123!', role: 'admin' },
    { name: 'Manager', email: 'manager@company.com', password: 'Manager123!', role: 'manager' },
    { name: 'Ivan', email: 'ivan@company.com', password: 'Employee123!', role: 'employee' },
    { name: 'Olena', email: 'olena@company.com', password: 'Employee123!', role: 'employee' },
];

await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

const collection = mongoose.connection.collection('users');
await collection.deleteMany({});
console.log('Cleared existing users');

for (const user of users) {
    const hashed = await bcrypt.hash(user.password, 12);
    await collection.insertOne({
        ...user,
        password: hashed,
        isActive: true,
        avatar: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log(`Created: ${user.email}`);
}

console.log('Done!');
await mongoose.disconnect();