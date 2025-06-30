# Sign-in Functionality Requirements (v1)

## 1. Overview
This document defines the functional requirements for the sign-in process for existing users to access the service. The sign-in flow proceeds in the order of `Email Verification`, `Password Authentication`, and `Two-Factor Authentication (2FA)`.

---

## 2. Step 1: Email Verification (`EmailStep`)

### 2.1. Functional Requirements
- **R-2.1.1**: The user must enter an email address.
- **R-2.1.2**: The system must validate in real-time if the entered email is in a valid format (`validateEmail`).
- **R-2.1.3**: When the user finishes typing their email (debounce 500ms), the system must automatically check if the email is registered in the database (`pm_user`) via `checkEmailExists`.
- **R-2.1.4**: If the email is registered, a green check icon must be displayed on the right side of the input field to inform the user.
- **R-2.1.5**: When the user clicks the 'Continue' button, the system must branch to the next step (`Sign-in` or `Sign-up`) based on the registration status.

### 2.2. Convenience Features
- **R-2.2.1**: If the 'Remember email' checkbox is selected, the user's email address must be saved in `localStorage` to be automatically filled on the next visit.
- **R-2.2.2**: A 'Continue with Google' button must be provided (currently displays an "in preparation" notification only).

---

## 3. Step 2: Password Authentication (`SigninStep`)

### 3.1. Functional Requirements
- **R-3.1.1**: The email address from the previous step must be displayed in a non-editable state.
- **R-3.1.2**: The user's name, retrieved from the database, must be displayed with masking for privacy (e.g., `J**n Doe`).
- **R-3.1.3**: The user must enter their password.
- **R-3.1.4**: Upon clicking the 'Continue' button, the system must verify the entered password by comparing its hash with the stored hash in the database using `bcrypt.compare`.
- **R-3.1.5**: On successful authentication, the flow must proceed to the 'Two-Factor Authentication' step.
- **R-3.1.6**: On failed authentication, an error message such as "Password does not match" must be displayed via a `toast` notification.

### 3.2. Convenience Features
- **R-3.2.1**: Clicking the 'Sign in with a different account' button must return the user to the email entry step.
- **R-3.2.2**: Clicking the 'Forgot your password?' link must navigate the user to the password reset flow (currently moves to `FindPasswordStep`).
- **R-3.2.3**: A 'Keep me logged in' checkbox should be provided (currently UI only).

---

## 4. Step 3: Two-Factor Authentication (`TwoFactorStep`)

### 4.1. Functional Requirements
- **R-4.1.1**: The user can choose between 'Authenticator App' or 'SMS' verification methods.
- **R-4.1.2**: The user must enter a 6-digit verification code.
- **R-4.1.3**: The system must validate the entered code (currently a Mock logic that accepts '123456' as the correct code).
- **R-4.1.4**: On successful verification, the flow must proceed to the 'Sign-in Success' step.
- **R-4.1.5**: On failed verification, an error message "Verification code is incorrect" must be displayed.

### 4.2. Convenience Features
- **R-4.2.1**: A 'Resend code' button must be available. When clicked, it should display a `toast` notification to inform the user that the code has been resent (currently logs to console only). 