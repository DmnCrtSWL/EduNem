import { supabase } from './supabase';

const TABLE_NAME = 'app_data';
const GROUPS_ID = 'groups';
const PLANS_ID = 'monthlyPlans';

export async function fetchGroups() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('id', GROUPS_ID)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching groups:", error);
    return null;
  }
}

export async function saveGroups(groups) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: GROUPS_ID, data: groups });
    if (error) throw error;
  } catch (error) {
    console.error("Error saving groups:", error);
  }
}

export async function fetchMonthlyPlans() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('data')
      .eq('id', PLANS_ID)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching monthly plans:", error);
    return null;
  }
}

export async function saveMonthlyPlans(plans) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .upsert({ id: PLANS_ID, data: plans });
    if (error) throw error;
  } catch (error) {
    console.error("Error saving monthly plans:", error);
  }
}

export async function seedDatabase(mockGroups, mockPlans) {
  if (!supabase) return;
  try {
    console.log("Seeding Supabase database...");
    await saveGroups(mockGroups);
    await saveMonthlyPlans(mockPlans);
    console.log("Supabase database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
