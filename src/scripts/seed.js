const { db } = require('@vercel/postgres');
const { invoices, projects, users } = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.sql`
          INSERT INTO users (id, name, email, password)
          VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      project_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.sql`
          INSERT INTO invoices (project_id, amount, status, date)
          VALUES (${invoice.project_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
          ON CONFLICT (id) DO NOTHING;
        `
      )
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedProjects(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "Projects" table if it doesn't exist
    const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS projects (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          hours INT NOT NULL
        );
      `;

    console.log(`Created "projects" table`);

    // Insert data into the "projects" table
    const insertedProjects = await Promise.all(
      projects.map(
        (project) => client.sql`
          INSERT INTO projects (id, name, hours)
          VALUES (${project.id}, ${project.name}, ${project.hours})
          ON CONFLICT (id) DO NOTHING;
        `
      )
    );

    console.log(`Seeded ${insertedProjects.length} projects`);

    return {
      createTable,
      projects: insertedProjects,
    };
  } catch (error) {
    console.error('Error seeding projects:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  // PURGE DATA
  await client.sql`
   DROP TABLE users;
 `;
  await client.sql`
  DROP TABLE projects;
 `;

  await seedUsers(client);
  await seedProjects(client);
  await seedInvoices(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err
  );
});
