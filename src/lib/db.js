const GROUPS_ID = 'groups';
const PLANS_ID = 'monthlyPlans';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

async function fetchFromApi(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${id}:`, error);
    return null;
  }
}

async function saveToApi(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    if (!response.ok) throw new Error('Network response was not ok');
  } catch (error) {
    console.error(`Error saving ${id}:`, error);
  }
}

export async function fetchGroups() {
  return fetchFromApi(GROUPS_ID);
}

export async function saveGroups(groups) {
  return saveToApi(GROUPS_ID, groups);
}

export async function fetchMonthlyPlans() {
  return fetchFromApi(PLANS_ID);
}

export async function saveMonthlyPlans(plans) {
  return saveToApi(PLANS_ID, plans);
}

export async function seedDatabase(mockGroups, mockPlans) {
  try {
    console.log("Seeding Postgres database...");
    await saveGroups(mockGroups);
    await saveMonthlyPlans(mockPlans);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
