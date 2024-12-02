import { encryptData } from "../utils/cryptoUtils";
import supabase, { supabaseUrl } from "./supabase";

export async function signup({
  fullname,
  contactno,
  email,
  password,
  createdby_id,
  createdby,
  accesstype,
  account_role,
  page_permission,
  action_permission,
  allowed_view_brgy,
  encryptedPassword,
  leader_id,
  baco_id,
  brgy,
}) {
  // Save the current session before signing up a new user
  const { data: savedSessionData } = await supabase.auth.getSession();
  const { data, error: userError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullname,
        contactno,
        avatar: "",
        accesstype,
        account_role,
        createdby_id,
        createdby,
        page_permission,
        action_permission,
        allowed_view_brgy,
        user_pass: encryptedPassword,
        leader_id,
        baco_id,
        brgy,
      },
    },
  });
  //If there was a previously authenticated user, restore their session
  if (savedSessionData) {
    await supabase.auth.setSession(savedSessionData.session);
  }

  if (userError) {
    throw new Error(userError.message);
  }

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  // this code will be Activated in Deployment
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("is_active", "active")
    .eq("accesstype", "Portal User")
    .single();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!userData) {
    throw new Error("User not found");
  }

  // Save page_permission to local storage
  const encrypted_page_permission = encryptData(userData.page_permission);
  const encrypted_action_permission = encryptData(userData.action_permission);

  localStorage.setItem("page_permission", encrypted_page_permission);
  localStorage.setItem("action_permission", encrypted_action_permission);
  localStorage.setItem("viewable_brgy", userData.allowed_view_brgy);
  return data;
}

export async function getCurrentUser_LoggedIn(id) {
  const { data, error } = await supabase
    .from("users")
    .select("account_role,user_pass")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem("page_permission");
  localStorage.removeItem("action_permission");
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullname, avatar }) {
  // 1. Update password OR fullname
  let updateData;
  if (password) updateData = { password };
  if (fullname) updateData = { data: { fullname } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);
  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in the user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  });

  if (error2) throw new Error(error2.message);
  return updatedUser;
}
