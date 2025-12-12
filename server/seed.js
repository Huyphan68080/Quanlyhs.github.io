import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Classroom } from './models/Classroom.js';
import { Student } from './models/Student.js';
import { Grade } from './models/Grade.js';

dotenv.config();

const SUBJECTS = ['Van', 'Toan', 'TiengAnh', 'Hoa', 'Su', 'Dia', 'VatLy', 'TheDuc'];
const GRADES = [10, 11, 12];
const SECTIONS = 'A1 A2 A3 A4 A5 A6 A7 A8 A9 A10'.split(' ');

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out to preserve data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Classroom.deleteMany({});
    await Student.deleteMany({});
    await Grade.deleteMany({});

    // Create admin user
    console.log('👤 Creating default admin user...');
    const adminExists = await User.findOne({ username: 'HuyPhan' });
    if (!adminExists) {
      const admin = new User({
        username: 'HuyPhan',
        passwordHash: 'Huyphan19082008',
        role: 'admin'
      });
      await admin.save();
      console.log('✓ Admin user created');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create classrooms
    console.log('📚 Creating classrooms...');
    const classroomNames = [];
    for (const grade of GRADES) {
      for (const section of SECTIONS) {
        const className = `${grade}${section}`;
        const classroom = new Classroom({ name: className, grade });
        await classroom.save();
        classroomNames.push(className);
      }
    }
    console.log(`✓ Created ${classroomNames.length} classrooms`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Default admin credentials:');
    console.log('   Username: HuyPhan');
    console.log('   Password: Huyphan19082008');
    console.log('\n💡 Available classes:');
    classroomNames.forEach(name => console.log(`   - ${name}`));
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');
  }
}

seedDatabase();
