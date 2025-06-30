# Sign-up Functionality Requirements (v1)

## 1. Overview
This document defines the functional requirements for the new user sign-up process. The sign-up flow proceeds in the order of `Email Verification`, `User Information Entry & Email Verification`, `Sign-up Success`, and `Two-Factor Authentication (2FA) Setup`.

---

## 2. Common Requirements

### 2.1. Internationalization
- **R-2.1.1**: All UI text in the sign-up flow (labels, buttons, placeholders, info messages, etc.) must support multiple languages (Korean, English).
- **R-2.1.2**: All validation error messages and toast notifications based on server responses must be displayed in the currently selected language.
- **R-2.1.3**: The language setting should default to the user's browser language and be changeable by the user via the floating menu.

---

## 3. Step 1: Email Verification (`EmailStep`)

### 3.1. Functional Requirements
- **R-3.1.1**: The user must enter an email address for registration.
- **R-3.1.2**: The system must validate in real-time if the entered email is in a valid format (`validateEmail`).
- **R-3.1.3**: When the user finishes typing their email (debounce 500ms), the system must automatically check if the email is a new, unregistered email in the database (`pm_user`) via `checkEmailExists`.
- **R-3.1.4**: If the email is unregistered, the system must recognize this and branch to the 'Sign-up' step when the 'Continue' button is clicked.

### 3.2. Convenience Features
- **R-3.2.1**: A 'Continue with Google' button must be provided (currently displays an "in preparation" notification only).

---

## 4. Step 2: User Information Entry & Email Verification (`SignupStep`)

### 4.1. Functional Requirements
- **R-4.1.1**: The email address from the previous step must be displayed in a non-editable state.
- **R-4.1.2**: The user must enter 'Name', 'Password', and 'Confirm Password' fields.
- **R-4.1.3**: The system must validate in real-time if the password meets the policy (min. 8 characters, including uppercase/lowercase letters, numbers, and special characters) and guide the user (`validatePassword`).
- **R-4.1.4**: The 'Sign up' button must be enabled only after the user agrees to the 'Terms of Service' and 'Privacy Policy'. (Content can be viewed via `LegalModal`).
- **R-4.1.5**: When the user clicks the 'Sign up' button, the system must send a 6-digit verification code to the entered email address.
- **R-4.1.6**: A UI for entering the verification code must appear, and the user must enter the code received via email.
- **R-4.1.7**: The verification code input field must be automatically focused when it appears.
- **R-4.1.8**: The system must validate if the entered code is correct.
- **R-4.1.9**: On successful verification, the flow must proceed to the 'Sign-up Success' step.
- **R-4.1.10**: On failed verification, an error message such as "Verification code is incorrect" must be displayed in the current language.

### 4.2. Convenience Features
- **R-4.2.1**: The left information panel (`SignUpInfoPanel`) should display informational text explaining the benefits of signing up (e.g., "Manage all your team's projects with one account.").
- **R-4.2.2**: Clicking the 'Sign up with a different account' button must return the user to the email entry step.

---

## 5. Step 3: Sign-up Success (`SuccessStep`)

### 5.1. Functional Requirements
- **R-5.1.1**: Upon successful sign-up and email verification, the `SuccessStep` component must be rendered.
- **R-5.1.2**: A welcome message such as "Successfully signed up" and the user's email address must be displayed.
- **R-5.1.3**: When the user clicks the 'Continue' button, the flow must proceed to the 'Two-Factor Authentication Setup' step.

---

## 6. Step 4: Two-Factor Authentication (TFA) Setup (`TwoFactorStep`)
- *Requirements are identical to the Two-Factor Authentication during sign-in (See `req_01_signin_eng_v1.md`, Section 4. Step 3)*
- **R-6.1.1**: For enhanced security, new users must complete the 2FA setup as a mandatory step.

---

## 7. Activity Logging

### 7.1. Functional Requirements
- **R-7.1.1**: **(Sign-up Success)** Upon final successful sign-up, the system must record an activity log with the type 'SignupSuccess' in the `pm_user_account_log` table. 