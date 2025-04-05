import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

//User registration function
export const registerUser = async (email, password, username) => {
  const signalId = 0;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return { status: "error", message: error.message };
  } else {
    console.log(data.user.id.slice(0, 8), username);
    const { data: userData, error: userError } = await supabase
      .from("users")
      .upsert({ id: data.user.id.slice(0, 8), email: email, username: username, signalID: signalId })
      .select();
    console.log(userData, userError);
    return { status: "success", user: { id: data.user.id.slice(0, 8), username: username, email: email } };
  }
};

//User login function
export const loginUser = async (email, password) => {
  const signalId = 0;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  const { data: signalData, error: signalError } = await supabase.from("users").update({ signalID: signalId }).eq("id", data.user.id.slice(0, 8));
  const { data: userData, error: userError } = await supabase.from("users").select("username").eq("id", data.user.id.slice(0, 8)).single();
  if (error || signalError || userError) {
    return { status: "error", message: error.message };
  } else {
    return { status: "success", message: data, username: userData.username };
  }
};
