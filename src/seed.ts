import { PrismaClient, LeadStage, LeadStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sample data arrays
const firstNames = [
  'John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava',
  'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander',
  'Amelia', 'Daniel', 'Harper', 'Matthew', 'Evelyn', 'David', 'Abigail',
  'Joseph', 'Emily', 'Samuel', 'Elizabeth', 'Christopher', 'Sofia', 'Andrew',
  'Avery', 'Joshua', 'Ella', 'Ryan', 'Scarlett', 'Nathan', 'Grace', 'Jacob',
  'Chloe', 'Nicholas', 'Victoria', 'Ethan', 'Riley', 'Tyler', 'Aria', 'Aaron',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
];

const companies = [
  'TechCorp', 'DataSystems', 'CloudNine', 'Innovate Inc', 'Digital Dynamics',
  'NextGen Solutions', 'Alpha Technologies', 'Beta Industries', 'Gamma Corp',
  'Delta Innovations', 'Epsilon Systems', 'Zeta Group', 'Eta Enterprises',
  'Theta Tech', 'Iota Solutions', 'Kappa Industries', 'Lambda Corp', 'Mu Systems',
  'Nu Technologies', 'Xi Innovations', 'Omicron Group', 'Pi Enterprises',
  'Rho Tech', 'Sigma Solutions', 'Tau Industries', 'Upsilon Corp', 'Phi Systems',
  'Chi Technologies', 'Psi Innovations', 'Omega Group', 'Quantum Leap', 'Stellar Dynamics',
  'Cosmic Solutions', 'Nebula Industries', 'Galaxy Corp', 'Meteor Systems',
];

const positions = [
  'CEO', 'CTO', 'CFO', 'VP of Sales', 'VP of Marketing', 'VP of Operations',
  'Director of Sales', 'Director of Marketing', 'Sales Manager', 'Marketing Manager',
  'Product Manager', 'Project Manager', 'Business Analyst', 'IT Manager',
  'Operations Manager', 'HR Manager', 'Account Manager', 'Sales Executive',
  'Marketing Executive', 'Business Development Manager', 'Senior Consultant',
];

const stages: LeadStage[] = [
  LeadStage.NEW,
  LeadStage.CONTACTED,
  LeadStage.QUALIFIED,
  LeadStage.PROPOSAL,
  LeadStage.NEGOTIATION,
  LeadStage.CLOSED_WON,
  LeadStage.CLOSED_LOST
];

const statuses: LeadStatus[] = [
  LeadStatus.ACTIVE,
  LeadStatus.INACTIVE,
  LeadStatus.CONVERTED,
  LeadStatus.REJECTED
];
const sources = [
  'Website', 'Referral', 'LinkedIn', 'Email Campaign', 'Trade Show',
  'Cold Call', 'Social Media', 'Partner', 'Advertisement', 'Webinar',
];

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'India', 'Japan', 'Brazil', 'Mexico', 'Singapore', 'Netherlands',
  'Sweden', 'Switzerland', 'Spain', 'Italy', 'South Korea', 'New Zealand',
];

const cities = [
  'New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Mumbai',
  'Tokyo', 'São Paulo', 'Mexico City', 'Singapore', 'Amsterdam', 'Stockholm',
  'Zurich', 'Madrid', 'Rome', 'Seoul', 'Auckland', 'Los Angeles', 'Chicago',
  'Boston', 'San Francisco', 'Seattle', 'Austin', 'Denver', 'Miami',
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seed() {
  try {
    console.log('🌱 Starting seed...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    console.log('👤 Creating demo user...');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo User',
      },
    });

    // Generate leads
    console.log('📊 Generating 500 leads...');
    const leads = [];
    const usedEmails = new Set<string>();

    for (let i = 0; i < 500; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      let email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomNumber(1, 999)}@example.com`;

      // Ensure unique email
      while (usedEmails.has(email)) {
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomNumber(1, 9999)}@example.com`;
      }
      usedEmails.add(email);

      const stage = getRandomItem(stages);
      const status = stage === LeadStage.CLOSED_WON ? LeadStatus.CONVERTED :
                     stage === LeadStage.CLOSED_LOST ? LeadStatus.REJECTED :
                     getRandomItem([LeadStatus.ACTIVE, LeadStatus.ACTIVE, LeadStatus.ACTIVE, LeadStatus.INACTIVE]); // More active leads

      const country = getRandomItem(countries);
      const createdAt = getRandomDate(new Date(2023, 0, 1), new Date());

      leads.push({
        firstName,
        lastName,
        email,
        phone: `+1-${getRandomNumber(200, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
        company: getRandomItem(companies),
        position: getRandomItem(positions),
        stage,
        status,
        source: getRandomItem(sources),
        value: getRandomNumber(5000, 500000),
        notes: Math.random() > 0.5 ? `Interested in our ${getRandomItem(['Enterprise', 'Premium', 'Standard'])} package` : undefined,
        assignedTo: Math.random() > 0.3 ? 'Demo User' : undefined,
        country,
        city: getRandomItem(cities),
        createdAt,
        updatedAt: createdAt,
      });
    }

    // Batch insert leads
    console.log('💾 Inserting leads into database...');
    await prisma.lead.createMany({
      data: leads,
    });

    console.log('✅ Seed completed successfully!');
    console.log(`📊 Created ${leads.length} leads`);
    console.log('👤 Demo credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
