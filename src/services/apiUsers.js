import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getUsersIDStaff({ page, searchTerm }) {
  let query = supabase
    .from("users")
    .select(`*`, {
      count: "exact",
    })
    // .eq("account_role", "ID Data Collector")
    // .eq("account_role", "ID Scanner Operator")
    .or(
      `account_role.eq.ID Data Collector,account_role.eq.QR Scanner Operator,account_role.eq.Event Attendance Scanner,account_role.eq.Event Scanner Releasing`
    )
    .order("id", {
      ascending: false,
    });

  if (searchTerm) {
    query = query.or(`fullname.ilike.%${searchTerm}%`);
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    // console.error(error);
    throw new Error("Baco Users could not be loaded");
  }
  // Adjust page if the requested range is not satisfiable
  if (data.length === 0 && page > 1) {
    // Adjust page to the maximum available page
    const maxPage = Math.ceil(count / PAGE_SIZE);
    if (page > maxPage) {
      return getUsers({ page: maxPage, searchTerm });
    }
  }

  return { data, count };
}

export async function getUsers_baco({ page, searchTerm }) {
  let query = supabase
    .from("users")
    .select(`*, baco!inner ( firstname,middlename, lastname, brgy)`, {
      count: "exact",
    })
    .eq("account_role", "Baco")
    .order("id", { ascending: false });

  if (searchTerm) {
    query = query.or(`fullname.ilike.%${searchTerm}%`);
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    // console.error(error);
    throw new Error("Baco Users could not be loaded");
  }
  // Adjust page if the requested range is not satisfiable
  if (data.length === 0 && page > 1) {
    // Adjust page to the maximum available page
    const maxPage = Math.ceil(count / PAGE_SIZE);
    if (page > maxPage) {
      return getUsers({ page: maxPage, searchTerm });
    }
  }

  return { data, count };
}

export async function getUsers({ brgy, page, searchTerm }) {
  let query = supabase
    .from("users")
    .select(`*, team!inner ( firstname, lastname, barangay,precinctno)`, {
      count: "exact",
    })
    .eq("team.barangay", brgy)
    .order("id", { ascending: false });

  if (searchTerm) {
    query = query.or(`fullname.ilike.%${searchTerm}%`);
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    // console.error(error);
    throw new Error("PL Users could not be loaded");
  }
  // Adjust page if the requested range is not satisfiable
  if (data.length === 0 && page > 1) {
    // Adjust page to the maximum available page
    const maxPage = Math.ceil(count / PAGE_SIZE);
    if (page > maxPage) {
      return getUsers({ brgy, page: maxPage, searchTerm });
    }
  }

  return { data, count };
}

export async function getUsersAdmin() {
  // const { data, error } = await supabase.from("users").select("*");

  const { data, error } = await supabase
    .from("users")
    .select(`*, team (firstname,lastname)`)
    .eq("accesstype", "Portal User")
    .not("email", "eq", "foolking.dev@gmail.com") // #this email was filtered-out , this only use in viewing in the supabase
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}
export async function getUsersPL() {
  // const { data, error } = await supabase.from("users").select("*");

  const { data, error } = await supabase
    .from("users")
    .select(`*, team (firstname,lastname)`)
    .eq("accesstype", "App User")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}

export async function createEditUser(newUserData, id) {
  //removing the team property inside the newUserData
  if ("team" in newUserData) {
    delete newUserData.team;
  }

  let query = supabase.from("users");

  if (id) query = query.update({ ...newUserData }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("User could not be created");
  }

  return data;
}

export async function deactivateUser(id) {
  const { data, error } = await supabase
    .from("users")
    .update({ is_active: "inactive" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("User successfully deactivated");
  }

  return data;
}

export async function activateUser(id) {
  const { data, error } = await supabase
    .from("users")
    .update({ is_active: "active" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("User could not be updated");
  }

  return data;
}
