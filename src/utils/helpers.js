import { formatDistance, parseISO } from "date-fns";
import { differenceInDays } from "date-fns/esm";
import { decryptData } from "./cryptoUtils";

// We want to make this function work for both Date objects and strings (which come from Supabase)
export const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  })
    .replace("about ", "")
    .replace("in", "In");

// Supabase needs an ISO date string. However, that string will be different on every render because the MS or SEC have changed, which isn't good. So we use this trick to remove any time
export const getToday = function (options = {}) {
  const today = new Date();

  // This is necessary to compare with created_at from Supabase, because it it not at 0.0.0.0, so we need to set the date to be END of the day when we compare it with earlier dates
  if (options?.end)
    // Set to the last second of the day
    today.setUTCHours(23, 59, 59, 999);
  else today.setUTCHours(0, 0, 0, 0);
  return today.toISOString();
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(
    value
  );

function isJSONString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
}

export const parsePagePermission = function (pagePermission) {
  let pagePermissionParse = null;

  // try {
  //   pagePermissionParse = JSON.parse(pagePermission);
  // } catch (error) {
  //   console.error("Error parsing JSON:", error);
  // }
  if (isJSONString(pagePermission))
    pagePermissionParse = JSON.parse(pagePermission);

  let permissions = null;
  if (Array.isArray(pagePermissionParse)) {
    permissions = pagePermission;
  } else {
    permissions = decryptData(pagePermission);
  }
  const data = JSON.parse(permissions);

  return data;
};

export const parsePage = function (pagePermission, page) {
  let pagePermissionParse = null;
  // try {
  //   pagePermissionParse = JSON.parse(pagePermission);
  // } catch (error) {
  //   console.error("Error parsing JSON:", error);
  // }
  if (isJSONString(pagePermission))
    pagePermissionParse = JSON.parse(pagePermission);

  let permissions = null;
  if (Array.isArray(pagePermissionParse)) {
    permissions = pagePermission;
  } else {
    permissions = decryptData(pagePermission);
  }

  const data = JSON.parse(permissions);
  let isAllowed = data.includes(page);

  return isAllowed;
};

export const parseAction = function (actionPermission, action) {
  // const cleanedString1 = actionPermission.replace(/^"(.*)"$/, "$1");
  const decrypted_act_permission = decryptData(actionPermission);
  const isAllowed = decrypted_act_permission.includes(action);
  return isAllowed;
};

export const replaceSpecialChars = (str) => {
  if (!str) return str;
  return str.replace("�", "Ñ");
};
export function formatToSixDigits(number) {
  return number.toString().padStart(6, "0");
}
