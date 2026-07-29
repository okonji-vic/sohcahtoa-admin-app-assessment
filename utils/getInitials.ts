/**
 * Generates a formatted full name from firstName and lastName.
 * If both names exist: "FirstName LastName"
 * If only one exists: returns that name
 * If neither exists: returns fallback (default: "---")
 */

export const getInitials = (fullname: string) => {
  const nameSplit = fullname.trim().split(" ");

  if (!fullname) {
    return "---";
  }

  if (nameSplit.length === 1) {
    return `${nameSplit[0].charAt(0).toUpperCase()}`;
  } else {
    return `${nameSplit[0].charAt(0).toUpperCase()}${(nameSplit.at(-1) ?? "")
      .charAt(0)
      .toUpperCase()}`;
  }
};

export const formatFullName = (fullname: string) => {
  const nameSplit = fullname.toLowerCase().trim().split(" ");

  if (!fullname) {
    return "---";
  }

  for (let i = 0; i < nameSplit.length; i++) {
    nameSplit[i] = nameSplit[i].charAt(0).toUpperCase() + nameSplit[i].slice(1);
  }

  return nameSplit.join(" ");
};

export const toTitleCase = (value: string) => {
  const str = value
    ?.toLowerCase()
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
  return str;
};

export const stringToBoolean = (value?: string | null): boolean => {
  if (!value) return false;

  return ["true", "1", "yes", "y", "on"].includes(value.toLowerCase().trim());
};
