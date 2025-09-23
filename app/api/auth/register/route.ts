import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password, name, role } = await request.json()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // --- FIX START ---
  // Use listUsers without pagination to get all potential matches.
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    email: email,
  });

  if (listError) {
    return NextResponse.json({ error: `User lookup failed: ${listError.message}` }, { status: 500 });
  }

  // IMPORTANT: listUsers can do a substring match. We must verify an exact match from the results.
  const existingUser = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
  // --- FIX END ---

  if (existingUser) {
    if (existingUser.email_confirmed_at) {
      return NextResponse.json({ error: "A user with this email is already registered." }, { status: 409 });
    } else {
      const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      await supabase.auth.resend({ type: 'signup', email });
      return NextResponse.json({ error: "A user with this email already exists but is not verified." }, { status: 409 });
    }
  }

  // Step 2: User does not exist. Proceed with sign up.
  const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data, error: signUpError } = await supabase.auth.signUp(
    { email, password },
    { data: { name, role } }
  );

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }
  if (!data.user) {
    return NextResponse.json({ error: "No user returned after sign up." }, { status: 500 });
  }

  // Step 3: Insert profile record for the new user.
  const { error: profileError } = await supabaseAdmin
    .from("profile")
    .insert([{ id: data.user.id, email, name, role }]);

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
    return NextResponse.json({ error: `Failed to create user profile: ${profileError.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}