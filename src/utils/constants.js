//VALIDATION RESULT: 0=dili, 1=ato, 2=undecided, 4=scanned
export const appVersion = "1.0.0";
export const dili = 0;
export const ato = 1;
export const undecided = 2;
export const deceased = 3;
export const outoftown = 4;
export const inc = 5;
export const jehovah = 6;
export const scanned_voted = 10;
export const PAGE_SIZE = 1000;
export const resultMapping = {
  0: "dili",
  1: "ato",
  2: "undecided",
  3: "deceased",
};
export const pageOptions = [
  { value: "dashboard", label: "Dashboard" },
  { value: "kamada", label: "Kamada" },
  { value: "voters_monitoring", label: "Voters Monitoring" },
  { value: "scan_verify", label: "Scan & Verify Voters" },
  { value: "voters_ato", label: "Asenso ID" },
  { value: "electorate", label: "Electorate" },
  { value: "teams", label: "Teams" },
  { value: "team_request", label: "Request" },
  { value: "special_electorate", label: "Special Electorates" },
  { value: "baco", label: "Baco" },
  { value: "events", label: "Events" },
  { value: "event_attendees", label: "Event Attendees" },
  { value: "services", label: "Services" },
  { value: "users", label: "Users" },
  { value: "account", label: "My Profile" },
  { value: "settings", label: "Settings" },
  { value: "rpt_event_attendees", label: "Report Event Attendees" },
  { value: "rpt_servicesbeneficiary", label: "Report Services Beneficiary" },
  // { value: "rpt_electorate_validated", label: "Report Electorate Validated" },
  {
    value: "rpt_electorate_classification",
    label: "Report Electorate Classification",
  },
  {
    value: "rpt_team_list",
    label: "Report Team List",
  },
  {
    value: "rpt_leader_hierarchy",
    label: "Report Leaders Hierarchy",
  },
  { value: "rpt_ulogs", label: "Report User Logs" },
];
export const pageOptions_staff = [
  { value: "electorate", label: "Electorate" },
  { value: "teams", label: "Teams" },
  { value: "team_request", label: "Request" },
  { value: "special_electorate", label: "Special Electorates" },
  { value: "baco", label: "Baco" },
  { value: "events", label: "Events" },
  { value: "event_attendees", label: "Event Attendees" },
  { value: "voters_ato", label: "Asenso ID" },
  { value: "services", label: "Services" },
  { value: "account", label: "My Profile" },
  { value: "rpt_event_attendees", label: "Report Event Attendees" },
  { value: "rpt_servicesbeneficiary", label: "Report Services Beneficiary" },
];
export const pageOptions_field_staff = [
  { value: "scan_verify", label: "Scan & Verify Voters" },
];
export const pageOptions_administrator = [
  { value: "dashboard", label: "Dashboard" },
  { value: "kamada", label: "Kamada" },
  { value: "voters_monitoring", label: "Voters Monitoring" },
  { value: "voters_ato", label: "Asenso ID" },
  { value: "electorate", label: "Electorate" },
  { value: "teams", label: "Teams" },
  { value: "team_request", label: "Request" },
  { value: "special_electorate", label: "Special Electorates" },
  { value: "baco", label: "Baco" },
  { value: "events", label: "Events" },
  { value: "event_attendees", label: "Event Attendees" },
  { value: "services", label: "Services" },
  { value: "users", label: "Users" },
  { value: "account", label: "My Profile" },
  { value: "settings", label: "Settings" },
  { value: "rpt_servicesbeneficiary", label: "Report Services Beneficiary" },
  // { value: "rpt_electorate_validated", label: "Report Electorate Validated" },
  {
    value: "rpt_team_list",
    label: "Report Team List",
  },
  {
    value: "rpt_electorate_classification",
    label: "Electorate Classification",
  },
  {
    value: "rpt_leader_hierarchy",
    label: "Report Leaders Hierarchy",
  },
  { value: "rpt_event_attendees", label: "Report Event Attendees" },
  { value: "rpt_ulogs", label: "Report User Logs" },
];

export const actionOptions = [
  "add baco",
  "update baco",
  // "delete baco",
  // "add electorate",
  "update electorate",
  "tag special electorate",
  "add team",
  "update team",
  "delete team",
  "team request approval",
  // "activation/deactivation team",
  "add services",
  "update services",
  "delete services",
  "add Baco user",
  "update Baco user",
  // "add PL user",
  // "update PL user",
  "view app password",
  "activation/deactivation user",
  "add admin user",
  "update admin user",
  "add event",
  "update event",
  "delete event",
  "activation/deactivation event",
  "add/remove event attendees",
];
export const actionOptions_staff = [
  "update electorate",
  "add team",
  "update team",
  "tag special electorate",
  "team request approval",
  // "activation/deactivation team",
  "add services",
  "update services",
  "delete services",
  "add event",
  "update event",
  "delete event",
  "activation/deactivation event",
  "add/remove event attendees",
];
export const actionOptions_administrator = [
  "add baco",
  "update baco",
  // "delete baco",
  "add electorate",
  "update electorate",
  "tag special electorate",
  "add team",
  "update team",
  "delete team",
  "team request approval",
  // "activation/deactivation team",
  "add services",
  "update services",
  "delete services",
  "add Baco user",
  "update Baco user",
  // "add PL user",
  // "update PL user",
  "view app password",
  "activation/deactivation user",
  "add event",
  "update event",
  "delete event",
  "activation/deactivation event",
  "add/remove event attendees",
];
export const brgy_allow = [
  "Alegria",
  "Balangasan",
  "Balintawak",
  "Baloyboan",
  "Banale",
  "Bogo",
  "Bomba",
  "Buenavista",
  "Bulatok",
  "Bulawan",
  "Dampalan",
  "Danlugan",
  "Dao",
  "Datagan",
  "Deborok",
  "Ditoray",
  "Dumagoc",
  "Gatas",
  "Gubac",
  "Gubang",
  "Kagawasan",
  "Kahayagan",
  "Kalasan",
  "Kawit",
  "La Suerte",
  "Lala",
  "Lapedian",
  "Lenienza",
  "Lison Valley",
  "Lourdes",
  "Lower Sibatang",
  "Lumad",
  "Lumbia",
  "Macasing",
  "Manga",
  "Muricay",
  "Napolan",
  "Palpalan",
  "Pedulonan",
  "Poloyagan",
  "San Francisco",
  "San Jose",
  "San Pedro",
  "Santa Lucia",
  "Santa Maria",
  "Santiago",
  "Santo Niño",
  "Tawagan Sur",
  "Tiguma",
  "Tuburan",
  "Tulangan",
  "Tulawas",
  "Upper Sibatang",
  "White Beach",
];
export const barangayOptions = [
  { value: "", label: "SELECT BARANGAY" },
  "Alegria",
  "Balangasan",
  "Balintawak",
  "Baloyboan",
  "Banale",
  "Bogo",
  "Bomba",
  "Buenavista",
  "Bulatok",
  "Bulawan",
  "Dampalan",
  "Danlugan",
  "Dao",
  "Datagan",
  "Deborok",
  "Ditoray",
  "Dumagoc",
  "Gatas",
  "Gubac",
  "Gubang",
  "Kagawasan",
  "Kahayagan",
  "Kalasan",
  "Kawit",
  "La Suerte",
  "Lala",
  "Lapedian",
  "Lenienza",
  "Lison Valley",
  "Lourdes",
  "Lower Sibatang",
  "Lumad",
  "Lumbia",
  "Macasing",
  "Manga",
  "Muricay",
  "Napolan",
  "Palpalan",
  "Pedulonan",
  "Poloyagan",
  "San Francisco",
  "San Jose",
  "San Pedro",
  "Santa Lucia",
  "Santa Maria",
  "Santiago",
  "Santo Niño",
  "Tawagan Sur",
  "Tiguma",
  "Tuburan",
  "Tulangan",
  "Tulawas",
  "Upper Sibatang",
  "White Beach",
].map((barangay) => {
  if (typeof barangay === "string") {
    return {
      value: barangay.toUpperCase(),
      label: barangay.toUpperCase(),
    };
  } else {
    return barangay; // Return as is
  }
});
export const religionOptions = [
  { value: "", label: "SELECT RELIGION" },
  "Roman Catholic",
  "Islam",
  "Iglesia ni Cristo",
  "Seventh Day Adventist",
  "Aglipay",
  "Iglesia Filipina Independiente",
  "Bible Baptist Church",
  "United Church of Christ in the Philippines",
  "Jehovah's Witness",
  "Church of Christ",
  "Other religious affiliations",
].map((barangay) => {
  if (typeof barangay === "string") {
    return {
      value: barangay.toUpperCase(),
      label: barangay.toUpperCase(),
    };
  } else {
    return barangay; // Return as is
  }
});

export const leaderTypeOptions = [
  { value: "", label: "SELECT TYPE" },
  "Grand Master",
  "Assistance Grand Master",
  "Legend",
  "Elite",
].map((type) => {
  if (typeof type === "string") {
    return {
      value: type.toUpperCase(),
      label: type.toUpperCase(),
    };
  } else {
    return type; // Return as is
  }
});

//unused--
export const sectorOptions = [
  { value: "", label: "SELECT SECTOR" },
  "BADAC",
  "BION",
  "BPAT",
  "FARMER",
  "FISHER FOLK",
  "QRT",
  "SENIOR CITIZEN",
  "WOMEN",
  "YOUTH",
].map((sector) => {
  if (typeof sector === "string") {
    return {
      value: sector.toUpperCase(),
      label: sector.toUpperCase(),
    };
  } else {
    return sector; // Return as is
  }
});

export const leader_position = ["Validator"];
export const account_role = ["Super Admin", "Administrator", "Staff"];
export const assistance_type = [
  "AICS",
  "Agricultural Support",
  "Burial Assistance",
  "Education",
  "Emergency Cash Assistance",
  "Emergency Response and Disaster Management",
  "Free Medicine/City Pharmacy",
  "Health Care",
  "Infrastructure Development",
  "Legal and Administrative Services",
  "Livelihood Support",
  "Social Amelioration Programs",
  "Social Welfare",
  "TUPAD",
];

export const validationMapping = {
  "1v": "first_validation",
  "2v": "second_validation",
  "3v": "third_validation",
  "4finalvalidation": "final_validation",
};

export const validationIds = {
  "1v": 1,
  "2v": 2,
  "3v": 3,
  "4finalvalidation": 4,
};
export const electorate_pcvl_remarks = [
  { value: "18-30", label: "Age 18-30" },
  { value: "Illiterate", label: "Illiterate" },
  { value: "PWD", label: "PWD" },
  { value: "Senior Citizen", label: "Senior Citizen" },
];
