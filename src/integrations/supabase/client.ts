// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ncrohqzkonbeqvowaskh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcm9ocXprb25iZXF2b3dhc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTUwMDYsImV4cCI6MjA2MzczMTAwNn0.k8OrCL65j96XR3F0bvH3EMAUbMcuC9rs9lAa_XneeX0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);