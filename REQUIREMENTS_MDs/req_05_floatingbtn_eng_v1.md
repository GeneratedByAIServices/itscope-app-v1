# Help Floating Button Feature Requirements (v1)

## 1. Overview
This document defines the user interface (UI) and functional requirements for the service-wide Help Floating Button (`HelpFloatingButton`).

---

## 2. UI and Interaction

### 2.1. Default State
- **R-2.1.1**: The button must be permanently fixed at the bottom-left of the screen (`bottom-8 left-8`) with `position: fixed`.
- **R-2.1.2**: The button should be circular and contain the service logo (`logo_symbol_color.png`).

### 2.2. Menu Expansion/Collapse
- **R-2.2.1 (Desktop)**: When the mouse cursor hovers over the button (`onMouseEnter`), a menu list should expand upwards with a smooth animation. The menu should collapse and disappear when the cursor leaves the button area (`onMouseLeave`).
- **R-2.2.2 (Mobile)**: In a touch environment, the menu list should toggle (expand or collapse) each time the button is clicked. The `useIsMobile` hook is used to detect the mobile environment.
- **R-2.2.3**: The menu list consists of four items: '고객센터 문의' (Customer Support), '자주 묻는 질문' (FAQ), '커뮤니티' (Community), and '학습센터' (Learning Center).

### 2.3. Visual Elements
- **R-2.3.1**: The floating button and its menu should have a semi-transparent background (`bg-zinc-900/80`) and a blur effect (`backdrop-blur-sm`).
- **R-2.3.2**: When the menu expands, each menu item should appear sequentially with a stagger animation effect.

---

## 3. Functional Requirements

### 3.1. Menu Functions
- **R-3.1.1**: Currently, clicking any menu item should display a `toast` notification indicating that the feature is "in preparation."

### 3.2. Hidden Feature (Easter Egg)
- **R-3.2.1**: If the 'Community' menu is clicked three times consecutively within one second, all notice-related data stored in `localStorage` (`hidden_notices`, `notice_hide_tooltip_shown_count`) must be deleted.
- **R-3.2.2**: After deleting the data, a `toast` notification stating "Cache has been cleared" should be displayed, and the page must automatically reload to reflect the changes immediately.
- **R-3.2.3**: This feature is provided for testing and development convenience. 