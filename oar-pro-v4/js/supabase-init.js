// OAR Pro v4 — Supabase Client Initialization
const SUPABASE_URL = 'https://ugblwepfptumffzcljot.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_I-dHtXacbDMPq226UeHnwA_wJcYdKOa';

// Initialize Supabase client (loaded from CDN in index.html)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getProfile() {
  const user = await getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return data;
}

async function isPaid() {
  const profile = await getProfile();
  return profile?.is_paid === true || profile?.account_type === 'preview' || profile?.account_type === 'admin';
}

async function isAdmin() {
  const profile = await getProfile();
  return profile?.account_type === 'admin';
}

// Session listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user.email);
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    window.location.hash = '#/';
  }
});
