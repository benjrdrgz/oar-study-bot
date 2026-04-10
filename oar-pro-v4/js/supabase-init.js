// OAR Pro v4 — Supabase Client Initialization
//
// BUG FIX: The CDN script in <head> does `var supabase = { createClient, ... }` (UMD module).
// We MUST use `var` here to reassign window.supabase from the UMD module
// to an actual client instance. Using const/let causes SyntaxError
// (can't redeclare var with const/let in global scope), killing this entire script.

var SUPABASE_URL = 'https://ugblwepfptumffzcljot.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnYmx3ZXBmcHR1bWZmemNsam90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3ODk1MTYsImV4cCI6MjA5MTM2NTUxNn0.RopXMlYK5a2zMQQ3slEPrKlBhIeRWfoeLY3y8OOOF38';

// Grab createClient BEFORE we overwrite the global
var _supabaseCreateClient = window.supabase && window.supabase.createClient;

if (typeof _supabaseCreateClient !== 'function') {
  console.error('[OAR] Supabase CDN failed to load. window.supabase:', typeof window.supabase);
  document.addEventListener('DOMContentLoaded', function() {
    var app = document.getElementById('app');
    if (app) {
      app.innerHTML =
        '<div style="text-align:center;padding:80px 20px;color:#F9FAFB;font-family:Inter,sans-serif">' +
        '<h2 style="color:#EF4444;margin-bottom:16px">Connection Error</h2>' +
        '<p style="color:#9CA3AF;max-width:400px;margin:0 auto">' +
        'Unable to load the app. Please check your internet connection and ' +
        '<a href="javascript:location.reload()" style="color:#3B82F6">try again</a>.</p></div>';
    }
  });
} else {
  // Reassign global: window.supabase goes from UMD module → client instance
  supabase = _supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('[OAR] Supabase client initialized successfully');
}

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
if (typeof supabase !== 'undefined' && supabase && supabase.auth) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('[OAR] User signed in:', session.user.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('[OAR] User signed out');
      window.location.hash = '#/';
    } else if (event === 'PASSWORD_RECOVERY') {
      // User landed via the password-reset email link.
      // Supabase has already exchanged the token — navigate to the update form.
      console.log('[OAR] Password recovery — routing to update-password');
      window.location.hash = '#/update-password';
    }
  });
}
