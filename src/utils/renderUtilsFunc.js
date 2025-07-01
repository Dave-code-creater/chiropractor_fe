export function renderDate(getDate) {
  if (!getDate) return "";
  const digits = String(getDate).replace(/\D/g, "");
  if (digits.length !== 8) return String(getDate);
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  return `${y}/${m}/${d}`;
}

export function renderCalAge(birthYear) {
  const yearNow = new Date().getFullYear(); // actual current year
  const y = Number(birthYear);

  // if birthYear is not a valid number, bail out
  if (isNaN(y)) return "";

  const age = yearNow - y;
  // optionally guard against negative ages
  return age >= 0 ? String(age) : "";
}

export function renderSSN(ssnNumber) {
  if (!ssnNumber) return "";
  const strSsn = String(ssnNumber);
  try {
    if (/[A-Za-z]/.test(strSsn)) {
      throw new TypeError("SSN contains alphabetic characters");
    }

    const digits = strSsn.replace(/\D/g, "");
    if (digits.length !== 9) {
      throw new RangeError("SSN must be 9 digits");
    }

    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 5);
    const part3 = digits.slice(5, 9);
    return `${part1}-${part2}-${part3}`;
  } catch (err) {
    console.error("renderSSN error", err);
    return "Invalid SSN";
  }
}

// Function for validating phone numbers
export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }

  const input = String(phoneNumber).trim();

  if (/[A-Za-z]/.test(input)) {
    throw new Error("Phone number cannot contain letters");
  }

  const digits = input.replace(/\D/g, "");

  if (digits.length < 10) {
    throw new Error("Phone number must be at least 10 digits");
  }

  if (digits.length > 11) {
    throw new Error("Phone number cannot be more than 11 digits");
  }

  if (digits.length === 11 && !digits.startsWith("1")) {
    throw new Error("11-digit phone number must start with 1");
  }

  // Validate area code (first 3 digits after country code)
  const areaCode =
    digits.length === 11 ? digits.slice(1, 4) : digits.slice(0, 3);
  if (areaCode.startsWith("0") || areaCode.startsWith("1")) {
    throw new Error("Invalid area code");
  }

  return digits; // Return clean digits for backend
}

export function renderPhoneNumber(phonenumber) {
  if (!phonenumber) return "";
  const input = String(phonenumber);

  try {
    if (/[A-Za-z]/.test(input)) {
      throw new TypeError("Phone number contains alphabetic characters");
    }

    const digits = input.replace(/\D/g, "");
    if (digits.length === 10) {
      // Return just the digits for backend compatibility
      // Backend expects format like: 6477787816 or +16477787816
      return digits;
    } else if (digits.length === 11 && digits.startsWith("1")) {
      // Handle 11-digit numbers starting with 1 (North American format)
      return digits;
    }

    // If not 10 or 11 digits, return original input
    return input;
  } catch (err) {
    console.error("renderPhoneNumber error:", err);
    // Return original input on error
    return phonenumber == null ? "" : String(phonenumber);
  }
}

// Function for displaying formatted phone numbers (for UI display only)
export function formatPhoneNumberForDisplay(phonenumber) {
  if (!phonenumber) return "";
  const input = String(phonenumber);

  try {
    if (/[A-Za-z]/.test(input)) {
      return input; // Return as-is if contains letters
    }

    const digits = input.replace(/\D/g, "");
    if (digits.length === 10) {
      const area = digits.slice(0, 3);
      const prefix = digits.slice(3, 6);
      const line = digits.slice(6);
      return `(${area}) ${prefix}-${line}`;
    } else if (digits.length === 11 && digits.startsWith("1")) {
      const area = digits.slice(1, 4);
      const prefix = digits.slice(4, 7);
      const line = digits.slice(7);
      return `+1 (${area}) ${prefix}-${line}`;
    }

    // If not standard format, return original
    return input;
  } catch (err) {
    console.error("formatPhoneNumberForDisplay error:", err);
    return phonenumber == null ? "" : String(phonenumber);
  }
}

export function renderStringLower(getString) {
  if (!getString) return "";

  if (/[A-Z]/.test(getString)) {
    return getString.toLowerCase();
  }
}

export function renderGmailExprs(getEmail) {
  // HTML5-style email regex;

  const html5EmailRe =
    /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;
  if (!getEmail) throw new Error("Do not let email empty");

  const email = String(getEmail).trim().toLocaleLowerCase();

  if (!html5EmailRe.test(email)) {
    throw new Error("Email is not a valid format");
  }
  return email;
}

export function renderPassword(getPassword) {
  if (getPassword === null || getPassword === "") {
    throw new Error("Password cannot be only spaces");
  }
  const pw = String(getPassword);

  if (pw.trim().length === 0) {
    throw new Error("Password cannot be only spaces ");
  }

  if (pw.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  return pw;
}

export function renderPwRegister(Password) {
  if (Password === null || Password === "") {
    throw new Error("Password cannot be only spaces");
  }
  const pw = String(Password).trim();
  if (pw.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!/[a-z]/.test(pw)) {
    throw new Error("Password must include at least one lowercase letter");
  }
  if (!/[A-Z]/.test(pw)) {
    throw new Error("Password must include at least one uppercase letter");
  }
  if (!/[0-9]/.test(pw)) {
    throw new Error("Password must include at least one digit");
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/~`+=;]/.test(pw)) {
    throw new Error("Password must include at least one special character");
  }
  if (/\s/.test(pw)) {
    throw new Error("Password must not contain spaces");
  }

  // All checks passed
  return pw;
}
