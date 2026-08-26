import { createClient } from '@supabase/supabase-js';
import { mockGroups } from './src/data/mockGroups.js';
import { defaultMonthlyData } from './src/data/mockAIPlans.js';

const supabaseUrl = 'https://hkoeqoulboeglrxytpte.supabase.co';
const supabaseAnonKey = 'sb_publishable_u2nuF0ADb50tJMqpcsV5hw_f01lK7tk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Seeding groups...");
  const { error: err1 } = await supabase.from('app_data').upsert({ id: 'groups', data: mockGroups });
  if (err1) console.error(err1);

  console.log("Seeding monthlyPlans...");
  const { error: err2 } = await supabase.from('app_data').upsert({ id: 'monthlyPlans', data: defaultMonthlyData });
  if (err2) console.error(err2);

  console.log("Seeding complete!");
}

run();
