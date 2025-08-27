/**
 * Form utility functions for validation and formatting
 */

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
  const yearNow = new Date().getFullYear();
  const y = Number(birthYear);

  if (isNaN(y)) return "";

  const age = yearNow - y;
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

// NEW: Auto-format SSN as user types with validation
export function autoFormatSSN(input) {
  if (!input) return { value: "", error: null };

  const inputStr = String(input);

  // Check for alphabetic characters
  if (/[A-Za-z]/.test(inputStr)) {
    return { value: inputStr, error: "SSN cannot contain letters" };
  }

  // Remove all non-digits
  const digits = inputStr.replace(/\D/g, "");

  // Check length before formatting
  if (digits.length > 9) {
    return { value: inputStr, error: "SSN cannot be more than 9 digits" };
  }

  // Format progressively as user types
  let formatted = digits;
  if (digits.length >= 4) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  if (digits.length >= 6) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  }

  // Validate complete SSN
  let error = null;
  if (digits.length > 0 && digits.length < 9) {
    error = null; // Allow partial input while typing
  } else if (digits.length === 9) {
    // Validate complete SSN
    if (digits === "000000000" || digits === "123456789") {
      error = "Invalid SSN format";
    }
  }

  return { value: formatted, error };
}

export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    throw new Error("Phone Number is required");
  }

  const input = String(phoneNumber).trim();

  if (/[A-Za-z]/.test(input)) {
    throw new Error("Phone Number cannot contain letters");
  }

  const digits = input.replace(/\D/g, "");

  if (digits.length < 10) {
    throw new Error("Phone Number must be at least 10 digits");
  }

  if (digits.length > 11) {
    throw new Error("Phone Number cannot be more than 11 digits");
  }

  if (digits.length === 11 && !digits.startsWith("1")) {
    throw new Error("11-Digit Phone Number must start with 1");
  }

  const areaCode = digits.length === 11 ? digits.slice(1, 4) : digits.slice(0, 3);
  if (areaCode.startsWith("0") || areaCode.startsWith("1")) {
    throw new Error("Invalid area code");
  }

  return digits;
}

// NEW: Auto-format phone number as user types with validation
export function autoFormatPhoneNumber(input) {
  if (!input) return { value: "", error: null };

  const inputStr = String(input);

  // Check for alphabetic characters
  if (/[A-Za-z]/.test(inputStr)) {
    return { value: inputStr, error: "Phone Number cannot contain letters" };
  }

  // Remove all non-digits
  const digits = inputStr.replace(/\D/g, "");

  // Check length before formatting
  if (digits.length > 11) {
    return { value: inputStr, error: "Phone Number cannot be more than 11 digits" };
  }

  // Format progressively as user types
  let formatted = digits;

  if (digits.length >= 1) {
    if (digits.length === 11 && digits.startsWith("1")) {
      // Format as +1 (xxx) xxx-xxxx
      const area = digits.slice(1, 4);
      const prefix = digits.slice(4, 7);
      const line = digits.slice(7);

      if (digits.length <= 4) {
        formatted = `+1 (${area}`;
      } else if (digits.length <= 7) {
        formatted = `+1 (${area}) ${prefix}`;
      } else {
        formatted = `+1 (${area}) ${prefix}-${line}`;
      }
    } else {
      // Format as (xxx) xxx-xxxx
      if (digits.length <= 3) {
        formatted = digits;
      } else if (digits.length <= 6) {
        const area = digits.slice(0, 3);
        const prefix = digits.slice(3);
        formatted = `(${area}) ${prefix}`;
      } else {
        const area = digits.slice(0, 3);
        const prefix = digits.slice(3, 6);
        const line = digits.slice(6);
        formatted = `(${area}) ${prefix}-${line}`;
      }
    }
  }

  // Validate area code for complete numbers
  let error = null;
  if (digits.length === 10) {
    const areaCode = digits.slice(0, 3);
    if (areaCode.startsWith("0") || areaCode.startsWith("1")) {
      error = "Invalid area code";
    }
  } else if (digits.length === 11) {
    if (!digits.startsWith("1")) {
      error = "11-Digit Number must start with 1";
    } else {
      const areaCode = digits.slice(1, 4);
      if (areaCode.startsWith("0") || areaCode.startsWith("1")) {
        error = "Invalid area code";
      }
    }
  } else if (digits.length > 0 && digits.length < 10) {
    error = null; // Allow partial input while typing
  }

  return { value: formatted, error };
}

export function renderPhoneNumber(phonenumber) {
  if (!phonenumber) return "";
  const input = String(phonenumber);

  try {
    if (/[A-Za-z]/.test(input)) {
      throw new TypeError("Phone number contains alphabetic characters");
    }

    const digits = input.replace(/\D/g, "");
    if (digits.length === 10 || (digits.length === 11 && digits.startsWith("1"))) {
      return digits;
    }

    return input;
  } catch (err) {
    console.error("renderPhoneNumber error:", err);
    return phonenumber == null ? "" : String(phonenumber);
  }
}

export function formatPhoneNumberForDisplay(phonenumber) {
  if (!phonenumber) return "";
  const input = String(phonenumber);

  try {
    if (/[A-Za-z]/.test(input)) {
      return input;
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

    return input;
  } catch (err) {
    console.error("formatPhoneNumberForDisplay error:", err);
    return phonenumber == null ? "" : String(phonenumber);
  }
}

export function validateEmail(email) {
  if (!email) {
    throw new Error("Email Address is required");
  }

  const emailStr = String(email).trim().toLowerCase();
  const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;

  if (!emailRegex.test(emailStr)) {
    throw new Error("Invalid Email Address format");
  }

  return emailStr;
}

export function validatePassword(password, isRegistration = false) {
  if (!password) {
    throw new Error("Password is required");
  }

  const pw = String(password).trim();

  if (pw.length === 0) {
    throw new Error("Password cannot be only spaces");
  }

  if (isRegistration) {
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
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;]/.test(pw)) {
      throw new Error("Password must include at least one special character");
    }
    if (/\s/.test(pw)) {
      throw new Error("Password must not contain spaces");
    }
  } else {
    if (pw.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
  }

  return pw;
}

export function renderGmailExprs(email) {
  if (!email) {
    throw new Error("Email Address is required");
  }

  const emailStr = String(email).trim().toLowerCase();
  const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;

  if (!emailRegex.test(emailStr)) {
    throw new Error("Invalid Email Address format");
  }

  return emailStr;
}

export function renderPwRegister(password) {
  if (!password) {
    throw new Error("Password is required");
  }

  const pw = String(password).trim();

  if (pw.length === 0) {
    throw new Error("Password cannot be only spaces");
  }

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
  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;]/.test(pw)) {
    throw new Error("Password must include at least one special character");
  }
  if (/\s/.test(pw)) {
    throw new Error("Password must not contain spaces");
  }

  return pw;
}

export function validateName(name) {
  if (!name) {
    throw new Error("Name is required");
  }

  const nameStr = String(name).trim();
  if (nameStr.length === 0) {
    throw new Error("Name cannot be empty");
  }

  if (nameStr.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  if (!/^[A-Za-z\s\-']+$/.test(nameStr)) {
    throw new Error("Name can only contain letters, spaces, hyphens and apostrophes");
  }

  return nameStr;
} 