

export function renderDate(getDate) {
    if (!getDate) return ''
    const digits = String(getDate).replace(/\D/g, '')
    if (digits.length !== 8) return String(getDate)
    const y = digits.slice(0, 4)
    const m = digits.slice(4, 6)
    const d = digits.slice(6, 8)
    return `${y}/${m}/${d}`
}


export function renderCalAge(birthYear) {
    const yearNow = new Date().getFullYear()      // actual current year
    const y = Number(birthYear)

    // if birthYear is not a valid number, bail out
    if (isNaN(y)) return ''

    const age = yearNow - y
    // optionally guard against negative ages
    return age >= 0 ? String(age) : ''
}


export function renderSSN(ssnNumber) {
    if (!ssnNumber) return ''
    const strSsn = String(ssnNumber);
    try {
        if (/[A-Za-z]/.test(strSsn)) {
            throw new TypeError('SSN contains alphabetic characters');
        }

        const digits = strSsn.replace(/\D/g, '');
        if (digits.length !== 9) {
            throw new RangeError('SSN must be 9 digits');
        }

        const part1 = digits.slice(0, 3)
        const part2 = digits.slice(3, 5)
        const part3 = digits.slice(5, 9)
        return `${part1}-${part2}-${part3}`
    } catch (err) {
        console.error('renderSSN error', err)
        return 'Invalid SSN'
    }


}

export function renderPhoneNumber(phonenumber) {
    if (!phonenumber) return ''
    const input = String(phonenumber)

    try {
        if (/[A-Za-z]/.test(input)) {
            throw new TypeError('Phone number contains alphabetic characters')
        }

        const digits = input.replace(/\D/g, '');
        if (digits.length === 10) {
            const area = digits.slice(0, 3)
            const prefix = digits.slice(3, 6)
            const line = digits.slice(6)
            return `(${area})-${prefix}-${line}`
        }

    } catch (err) {
        console.error('renderPhoneNumber error:', err)
        // Return original input on error
        return phonenumber == null ? '' : String(phonenumber)
    }

}

export function renderStringLower(getString) {
    if (!getString) return ''

    if (/[A-Z]/.test(getString)) {
        return getString.toLowerCase();
    }

}

export function renderGmailExprs(getEmail) {
    // HTML5-style email regex;

    const html5EmailRe = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*$/;
    if (!getEmail)
        throw new Error('Do not let email empty');

    const email = String(getEmail).trim().toLocaleLowerCase();


    if (!html5EmailRe.test(email)) {
        throw new Error('Email is not a valid format')
    }
    return email
}


export function renderPassword(getPassword) {
    if (getPassword === null || getPassword === '') {
        throw new Error('Password cannot be only spaces')
    }
    const pw = String(getPassword);

    if (pw.trim().length === 0) {
        throw new Error('Password cannot be only spaces ')
    }

    if (pw.length < 6) {
        throw new Error('Password must be at least 6 characters')
    }

    return pw

}

export function renderPwRegister(Password) {
    if (Password === null || Password === '') {
        throw new Error('Password cannot be only spaces')
    }
    const pw = String(Password).trim()
    if (pw.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(pw)) {
        throw new Error('Password must include at least one lowercase letter');
    }
    if (!/[A-Z]/.test(pw)) {
        throw new Error('Password must include at least one uppercase letter');
    }
    if (!/[0-9]/.test(pw)) {
        throw new Error('Password must include at least one digit');
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/~`+=;]/.test(pw)) {
        throw new Error('Password must include at least one special character');
    }
    if (/\s/.test(pw)) {
        throw new Error('Password must not contain spaces');
    }

    // All checks passed
    return pw;
}
