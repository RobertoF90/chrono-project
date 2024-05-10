const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const projects = [
  {
    id: '13D07535-C59E-4157-A021-F8D2EF4E0CBB',
    name: 'project1',
    hours: '6',
  },

  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B8',
    name: 'project2',
    hours: '3',
  },
];

const invoices = [
  {
    project_id: projects[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
];

module.exports = {
  users,
  projects,
  invoices,
};
