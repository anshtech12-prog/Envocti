const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
if (!process.env.MONGO_URI) dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const PickupRequest = require('../models/PickupRequest');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');

/**
 * Sample Data Seeder
 * Creates demo users, collectors, admin, pickup requests, rewards, and notifications
 */
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ewaste_management');
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await PickupRequest.deleteMany({});
    await Reward.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ewaste.com',
      password: 'admin123',
      phone: '9999999999',
      role: 'admin',
      address: { street: '1 Admin Plaza', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    });

    // Create Collectors
    const collector1 = await User.create({
      name: 'Rahul Sharma',
      email: 'collector1@ewaste.com',
      password: 'collector123',
      phone: '8888888881',
      role: 'collector',
      address: { street: '25 Green Lane', city: 'Mumbai', state: 'Maharashtra', pincode: '400050' },
    });

    const collector2 = await User.create({
      name: 'Priya Patel',
      email: 'collector2@ewaste.com',
      password: 'collector123',
      phone: '8888888882',
      role: 'collector',
      address: { street: '42 Eco Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    });

    // Create Users
    const user1 = await User.create({
      name: 'Amit Kumar',
      email: 'user1@ewaste.com',
      password: 'user1234',
      phone: '7777777771',
      role: 'user',
      address: { street: '10 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
      greenScore: 320,
      totalPickups: 5,
    });

    const user2 = await User.create({
      name: 'Sneha Reddy',
      email: 'user2@ewaste.com',
      password: 'user1234',
      phone: '7777777772',
      role: 'user',
      address: { street: '55 Park Street', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
      greenScore: 180,
      totalPickups: 3,
    });

    const user3 = await User.create({
      name: 'Vikram Singh',
      email: 'user3@ewaste.com',
      password: 'user1234',
      phone: '7777777773',
      role: 'user',
      address: { street: '8 Lake View', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      greenScore: 450,
      totalPickups: 7,
    });

    console.log('👥 Users created');

    // Create Pickup Requests
    const pickups = await PickupRequest.insertMany([
      {
        user: user1._id,
        collector: collector1._id,
        category: 'laptop',
        quantity: 2,
        description: 'Old Dell laptops, not working',
        address: { street: '10 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
        pickupDate: new Date('2026-06-28'),
        pickupTime: '9:00 AM - 12:00 PM',
        status: 'completed',
        estimatedWeight: 5,
        rewardPoints: 200,
        statusHistory: [
          { status: 'pending', timestamp: new Date('2026-06-20'), note: 'Request created' },
          { status: 'assigned', timestamp: new Date('2026-06-21'), note: 'Assigned to Rahul' },
          { status: 'in-progress', timestamp: new Date('2026-06-22'), note: 'Collector en route' },
          { status: 'collected', timestamp: new Date('2026-06-22'), note: 'Items collected' },
          { status: 'recycled', timestamp: new Date('2026-06-25'), note: 'Sent to recycling facility' },
          { status: 'completed', timestamp: new Date('2026-06-26'), note: 'Recycling complete' },
        ],
      },
      {
        user: user1._id,
        category: 'mobile',
        quantity: 3,
        description: 'Old smartphones',
        address: { street: '10 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400020' },
        pickupDate: new Date('2026-07-01'),
        pickupTime: '12:00 PM - 3:00 PM',
        status: 'pending',
        estimatedWeight: 0.5,
        statusHistory: [
          { status: 'pending', timestamp: new Date(), note: 'Request created' },
        ],
      },
      {
        user: user2._id,
        collector: collector2._id,
        category: 'tv',
        quantity: 1,
        description: 'Old CRT television',
        address: { street: '55 Park Street', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
        pickupDate: new Date('2026-06-30'),
        pickupTime: '9:00 AM - 12:00 PM',
        status: 'assigned',
        estimatedWeight: 15,
        statusHistory: [
          { status: 'pending', timestamp: new Date('2026-06-24'), note: 'Request created' },
          { status: 'assigned', timestamp: new Date('2026-06-25'), note: 'Assigned to Priya' },
        ],
      },
      {
        user: user2._id,
        collector: collector1._id,
        category: 'battery',
        quantity: 10,
        description: 'Used laptop and phone batteries',
        address: { street: '55 Park Street', city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
        pickupDate: new Date('2026-06-29'),
        pickupTime: '3:00 PM - 6:00 PM',
        status: 'in-progress',
        estimatedWeight: 2,
        statusHistory: [
          { status: 'pending', timestamp: new Date('2026-06-22'), note: 'Request created' },
          { status: 'assigned', timestamp: new Date('2026-06-23'), note: 'Assigned to Rahul' },
          { status: 'in-progress', timestamp: new Date('2026-06-26'), note: 'Collector accepted' },
        ],
      },
      {
        user: user3._id,
        category: 'charger',
        quantity: 5,
        description: 'Assorted phone and laptop chargers',
        address: { street: '8 Lake View', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        pickupDate: new Date('2026-07-03'),
        pickupTime: '12:00 PM - 3:00 PM',
        status: 'pending',
        estimatedWeight: 1,
        statusHistory: [
          { status: 'pending', timestamp: new Date(), note: 'Request created' },
        ],
      },
      {
        user: user3._id,
        collector: collector2._id,
        category: 'laptop',
        quantity: 1,
        description: 'MacBook Air 2018 - screen broken',
        address: { street: '8 Lake View', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
        pickupDate: new Date('2026-06-27'),
        pickupTime: '9:00 AM - 12:00 PM',
        status: 'collected',
        estimatedWeight: 1.5,
        statusHistory: [
          { status: 'pending', timestamp: new Date('2026-06-20'), note: 'Request created' },
          { status: 'assigned', timestamp: new Date('2026-06-21'), note: 'Assigned to Priya' },
          { status: 'in-progress', timestamp: new Date('2026-06-22'), note: 'Collector accepted' },
          { status: 'collected', timestamp: new Date('2026-06-25'), note: 'Item collected' },
        ],
      },
    ]);

    console.log('📋 Pickup requests created');

    // Create Rewards for completed pickups
    await Reward.create({
      user: user1._id,
      pickup: pickups[0]._id,
      points: 200,
      type: 'pickup_completed',
      description: 'Earned 200 points for recycling 2 laptop(s)',
    });

    console.log('🏆 Rewards created');

    // Create Notifications
    await Notification.insertMany([
      {
        user: user1._id,
        title: 'Pickup Completed! 🎉',
        message: 'Your laptop pickup has been completed! You earned 200 green points.',
        type: 'reward',
        isRead: true,
        relatedPickup: pickups[0]._id,
      },
      {
        user: user1._id,
        title: 'New Pickup Request Created',
        message: 'Your pickup request for 3 mobile(s) has been submitted.',
        type: 'pickup_update',
        isRead: false,
        relatedPickup: pickups[1]._id,
      },
      {
        user: user2._id,
        title: 'Collector Assigned',
        message: 'A collector (Priya Patel) has been assigned to your TV pickup.',
        type: 'pickup_update',
        isRead: false,
        relatedPickup: pickups[2]._id,
      },
      {
        user: collector1._id,
        title: 'New Pickup Assigned',
        message: 'A new battery pickup has been assigned to you. Quantity: 10',
        type: 'assignment',
        isRead: false,
        relatedPickup: pickups[3]._id,
      },
    ]);

    console.log('🔔 Notifications created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('─────────────────────────────────');
    console.log('Admin:     admin@ewaste.com / admin123');
    console.log('Collector: collector1@ewaste.com / collector123');
    console.log('Collector: collector2@ewaste.com / collector123');
    console.log('User:      user1@ewaste.com / user1234');
    console.log('User:      user2@ewaste.com / user1234');
    console.log('User:      user3@ewaste.com / user1234');
    console.log('─────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
