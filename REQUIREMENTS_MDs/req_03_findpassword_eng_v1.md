# Find Password Functionality Requirements (v1)

## 1. Overview
This document defines the functional requirements for the process that allows an existing user who has forgotten their password to reset it.

---

## 2. Common Requirements

### 2.1. Internationalization
- **R-2.1.1**: All UI text in the find password flow (labels, buttons, info messages, etc.) must support multiple languages (Korean, English).
- **R-2.1.2**: All toast notifications based on server responses must be displayed in the currently selected language.

---

## 3. Password Reset Procedure (`FindPasswordStep`)

### 3.1. Functional Requirements
- **R-3.1.1**: When a user clicks the 'Forgot your password?' link on the sign-in screen (`SigninStep`), they must be navigated to the `FindPasswordStep`.
- **R-3.1.2**: The user's email address must be displayed on the screen in a non-editable state.
- **R-3.1.3**: When the user clicks the 'Get reset link' button, the system must send a password reset link to that email address (using Supabase Auth `resetPasswordForEmail` functionality).
- **R-3.1.4**: After sending the link, the system must display a success message, such as "A password reset link has been sent to your email," as a `toast` notification in the currently selected language.
- **R-3.1.5**: After the toast notification, the user must be automatically returned to the previous step, `SigninStep`.

### 3.2. Convenience Features
- **R-3.2.1**: A 'Back to Sign in' link must be provided, allowing the user to cancel the reset process and return immediately to the sign-in screen if they wish. 