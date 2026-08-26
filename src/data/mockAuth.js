export const mockUsers = [
  {
    id: 'usr_1',
    username: 'docente',
    password: '123',
    role: 'teacher',
    name: 'Profe Ricardo'
  },
  {
    id: 'usr_2',
    username: 'director',
    password: '123',
    role: 'director',
    name: 'Dirección Plantel #45'
  },
  {
    id: 'usr_3',
    username: 'padre',
    password: '123',
    role: 'parent',
    name: 'Tutor Legal'
  },
  {
    id: 'usr_4',
    username: 'social',
    password: '123',
    role: 'social',
    name: 'Trabajo Social CDMX'
  }
];

export const authenticate = (username, password) => {
  return mockUsers.find(u => u.username === username && u.password === password) || null;
};
