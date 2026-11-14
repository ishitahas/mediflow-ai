let PrismaClient;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (e) {
  PrismaClient = require('../backend/node_modules/@prisma/client').PrismaClient;
}

let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = require('../backend/node_modules/bcryptjs');
}

const prisma = new PrismaClient();

const DOCTOR_SEEDS = [
  // Existing Doctor 1
  {
    name: 'Dr. Rajesh Sharma',
    email: 'dr.sharma@mediflow.com',
    phone: '+91 98111 22334',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    experience: 12,
    qualification: 'MBBS, MD (Cardiology)',
    consultationFee: 800.0,
    consultationDuration: 30,
    roomNumber: 'Room 101',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '13:00' },
    ],
  },
  // Existing Doctor 2
  {
    name: 'Dr. Ananya Patel',
    email: 'dr.patel@mediflow.com',
    phone: '+91 98222 33445',
    specialization: 'Neurologist',
    department: 'Neurology',
    experience: 8,
    qualification: 'MBBS, DM (Neurology)',
    consultationFee: 1000.0,
    consultationDuration: 30,
    roomNumber: 'Room 204',
    schedules: [
      { dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 'THURSDAY', startTime: '10:00', endTime: '16:00' },
      { dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '14:00' },
    ],
  },
  // Doctor 3: Nephrologist
  {
    name: 'Dr. Sunil Jawale',
    email: 'dr.jawale@mediflow.com',
    phone: '+91 98333 11221',
    specialization: 'Nephrologist',
    department: 'Nephrology',
    experience: 15,
    qualification: 'MBBS, MD, DM (Nephrology)',
    consultationFee: 900.0,
    consultationDuration: 30,
    roomNumber: 'Room 302',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '14:00' },
    ],
  },
  // Doctor 4: Orthopedic Surgeon
  {
    name: 'Dr. Rajesh Parasnis',
    email: 'dr.parasnis@mediflow.com',
    phone: '+91 98444 22332',
    specialization: 'Orthopedic Surgeon',
    department: 'Orthopedics',
    experience: 18,
    qualification: 'MBBS, MS (Orthopedics), M.Ch (Spine)',
    consultationFee: 1100.0,
    consultationDuration: 30,
    roomNumber: 'Room 208',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'FRIDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '13:00' },
    ],
  },
  // Doctor 5: Dermatologist
  {
    name: 'Dr. Vidita Powle',
    email: 'dr.powle@mediflow.com',
    phone: '+91 98555 33443',
    specialization: 'Dermatologist',
    department: 'Dermatology',
    experience: 10,
    qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    consultationFee: 750.0,
    consultationDuration: 30,
    roomNumber: 'Room 105',
    schedules: [
      { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '15:00' },
    ],
  },
  // Doctor 6: Pediatrician
  {
    name: 'Dr. Priya Sundaram',
    email: 'dr.sundaram@mediflow.com',
    phone: '+91 98666 44554',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    experience: 11,
    qualification: 'MBBS, MD (Pediatrics), DCH',
    consultationFee: 700.0,
    consultationDuration: 30,
    roomNumber: 'Room 112',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '08:30', endTime: '16:30' },
      { dayOfWeek: 'TUESDAY', startTime: '08:30', endTime: '16:30' },
      { dayOfWeek: 'THURSDAY', startTime: '08:30', endTime: '16:30' },
      { dayOfWeek: 'FRIDAY', startTime: '08:30', endTime: '16:30' },
    ],
  },
  // Doctor 7: General Physician
  {
    name: 'Dr. Arvind Kulkarni',
    email: 'dr.kulkarni@mediflow.com',
    phone: '+91 98777 55665',
    specialization: 'General Physician',
    department: 'General Medicine',
    experience: 14,
    qualification: 'MBBS, MD (Internal Medicine), FACP',
    consultationFee: 600.0,
    consultationDuration: 30,
    roomNumber: 'Room 102',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '14:00' },
    ],
  },
  // Doctor 8: Gynecologist
  {
    name: 'Dr. Meera Nambiar',
    email: 'dr.nambiar@mediflow.com',
    phone: '+91 98888 66776',
    specialization: 'Gynecologist',
    department: 'Obstetrics & Gynecology',
    experience: 13,
    qualification: 'MBBS, MS (Obstetrics & Gynecology), DGO',
    consultationFee: 850.0,
    consultationDuration: 30,
    roomNumber: 'Room 215',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '09:30', endTime: '17:30' },
      { dayOfWeek: 'WEDNESDAY', startTime: '09:30', endTime: '17:30' },
      { dayOfWeek: 'THURSDAY', startTime: '09:30', endTime: '17:30' },
      { dayOfWeek: 'SATURDAY', startTime: '09:30', endTime: '14:00' },
    ],
  },
  // Doctor 9: Dentist
  {
    name: 'Dr. Ketan Vartak',
    email: 'dr.vartak@mediflow.com',
    phone: '+91 98999 77887',
    specialization: 'Dentist',
    department: 'Dentistry',
    experience: 9,
    qualification: 'BDS, MDS (Oral & Maxillofacial Surgery)',
    consultationFee: 650.0,
    consultationDuration: 30,
    roomNumber: 'Room 108',
    schedules: [
      { dayOfWeek: 'TUESDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'FRIDAY', startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 'SATURDAY', startTime: '10:00', endTime: '16:00' },
    ],
  },
  // Doctor 10: Ophthalmologist
  {
    name: 'Dr. Rohan Deshmukh',
    email: 'dr.deshmukh@mediflow.com',
    phone: '+91 98112 88998',
    specialization: 'Ophthalmologist',
    department: 'Ophthalmology',
    experience: 12,
    qualification: 'MBBS, MS (Ophthalmology), FICO (UK)',
    consultationFee: 750.0,
    consultationDuration: 30,
    roomNumber: 'Room 304',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '16:00' },
    ],
  },
  // Doctor 11: Psychiatrist
  {
    name: 'Dr. Kavita Singhania',
    email: 'dr.singhania@mediflow.com',
    phone: '+91 98223 99009',
    specialization: 'Psychiatrist',
    department: 'Psychiatry & Behavioral Health',
    experience: 11,
    qualification: 'MBBS, MD (Psychiatry), DPM',
    consultationFee: 1200.0,
    consultationDuration: 45,
    roomNumber: 'Room 401',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '11:00', endTime: '19:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '11:00', endTime: '19:00' },
      { dayOfWeek: 'FRIDAY', startTime: '11:00', endTime: '19:00' },
      { dayOfWeek: 'SATURDAY', startTime: '11:00', endTime: '16:00' },
    ],
  },
  // Doctor 12: ENT Specialist
  {
    name: 'Dr. Naresh Munot',
    email: 'dr.munot@mediflow.com',
    phone: '+91 98334 10110',
    specialization: 'ENT Specialist',
    department: 'ENT (Otorhinolaryngology)',
    experience: 16,
    qualification: 'MBBS, MS (ENT), DNB (Otolaryngology)',
    consultationFee: 800.0,
    consultationDuration: 30,
    roomNumber: 'Room 118',
    schedules: [
      { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 'SATURDAY', startTime: '09:00', endTime: '14:00' },
    ],
  },
  // Doctor 13: Physiotherapist
  {
    name: 'Dr. Pooja Hegde',
    email: 'dr.hegde@mediflow.com',
    phone: '+91 98445 21221',
    specialization: 'Physiotherapist',
    department: 'Physiotherapy & Rehabilitation',
    experience: 7,
    qualification: 'BPT, MPT (Musculoskeletal & Sports Physiotherapy)',
    consultationFee: 550.0,
    consultationDuration: 30,
    roomNumber: 'Room 120',
    schedules: [
      { dayOfWeek: 'MONDAY', startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 'TUESDAY', startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 'WEDNESDAY', startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 'THURSDAY', startTime: '08:00', endTime: '16:00' },
      { dayOfWeek: 'FRIDAY', startTime: '08:00', endTime: '16:00' },
    ],
  },
];

async function main() {
  console.log('🌱 Starting database seed for MediFlow AI...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Seed or Upsert Admin User
  console.log('👤 Seeding Admin User...');
  await prisma.user.upsert({
    where: { email: 'admin@mediflow.com' },
    update: {
      name: 'System Admin',
      phone: '+91 98765 43210',
    },
    create: {
      name: 'System Admin',
      email: 'admin@mediflow.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 98765 43210',
    },
  });

  // 2. Seed or Upsert Patients
  console.log('🧑‍⚕️ Seeding Patients...');
  const patientUsers = [
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 98333 44556',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'MALE',
      bloodGroup: 'B+',
      address: '24 MG Road, New Delhi',
      emergencyContact: '+91 98999 11223',
      medicalHistory: 'Hypertension diagnosed in 2021',
    },
    {
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91 98444 55667',
      dateOfBirth: new Date('1995-11-20'),
      gender: 'FEMALE',
      bloodGroup: 'O+',
      address: '15 Park Street, Kolkata',
      emergencyContact: '+91 98888 22334',
      medicalHistory: 'Frequent migraine episodes',
    },
    {
      name: 'Amit Sharma',
      email: 'amit.sharma@example.com',
      phone: '+91 98555 66778',
      dateOfBirth: new Date('1988-03-10'),
      gender: 'MALE',
      bloodGroup: 'A+',
      address: '88 Brigade Road, Bengaluru',
      emergencyContact: '+91 98777 33445',
      medicalHistory: 'Mild asthma, no prior heart conditions',
    },
  ];

  for (const p of patientUsers) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        name: p.name,
        phone: p.phone,
      },
      create: {
        name: p.name,
        email: p.email,
        password: hashedPassword,
        role: 'PATIENT',
        phone: p.phone,
      },
    });

    await prisma.patient.upsert({
      where: { userId: user.id },
      update: {
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        address: p.address,
        emergencyContact: p.emergencyContact,
        medicalHistory: p.medicalHistory,
      },
      create: {
        userId: user.id,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        bloodGroup: p.bloodGroup,
        address: p.address,
        emergencyContact: p.emergencyContact,
        medicalHistory: p.medicalHistory,
      },
    });
  }

  // 3. Seed or Upsert Doctors & Working Schedules
  console.log('🩺 Seeding Doctors & Availabilities...');
  for (const docData of DOCTOR_SEEDS) {
    const user = await prisma.user.upsert({
      where: { email: docData.email },
      update: {
        name: docData.name,
        phone: docData.phone,
      },
      create: {
        name: docData.name,
        email: docData.email,
        password: hashedPassword,
        role: 'DOCTOR',
        phone: docData.phone,
      },
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {
        specialization: docData.specialization,
        department: docData.department,
        experience: docData.experience,
        qualification: docData.qualification,
        consultationFee: docData.consultationFee,
        consultationDuration: docData.consultationDuration,
        roomNumber: docData.roomNumber,
        currentPresence: 'AVAILABLE',
      },
      create: {
        userId: user.id,
        specialization: docData.specialization,
        department: docData.department,
        experience: docData.experience,
        qualification: docData.qualification,
        consultationFee: docData.consultationFee,
        consultationDuration: docData.consultationDuration,
        roomNumber: docData.roomNumber,
        currentPresence: 'AVAILABLE',
      },
    });

    // Sync Availabilities
    const existingAvails = await prisma.doctorAvailability.findMany({
      where: { doctorId: doctor.id },
    });

    if (existingAvails.length === 0) {
      await prisma.doctorAvailability.createMany({
        data: docData.schedules.map((s) => ({
          doctorId: doctor.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isAvailable: true,
          presenceStatus: 'AVAILABLE',
        })),
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log({
    usersCount: await prisma.user.count(),
    doctorsCount: await prisma.doctor.count(),
    patientsCount: await prisma.patient.count(),
    availabilitiesCount: await prisma.doctorAvailability.count(),
    appointmentsCount: await prisma.appointment.count(),
    waitlistCount: await prisma.waitlist.count(),
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
