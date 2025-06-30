# System Notice Feature Requirements (v1)

## 1. Overview
This document defines the user interface (UI) and functional requirements for the system notice feature. The relevant components are `NoticeList`, `NoticeCard`, and `NoticeDetailModal`.

---

## 2. Notice List (`NoticeList.tsx`)

### 2.1. Data Loading
- **R-2.1.1**: While fetching the notice list data from the server, a skeleton UI must be displayed to indicate that loading is in progress.
- **R-2.1.2**: Exception handling for data loading failures is necessary (not currently implemented, requires future improvement).

### 2.2. Data Filtering and Sorting
- **R-2.2.1**: Only notices with the `is_published` property set to `true` should be displayed in the list.
- **R-2.2.2**: Only notices within their valid publication period, based on `publish_start_dt` and `publish_end_dt` relative to the current time, should be displayed.
- **R-2.2.3**: Notices with the `is_pinned` property set to `true` must be sorted to the top of the list.

### 2.3. Hiding Notices (Mark as Read)
- **R-2.3.1**: When a user clicks the 'Hide' button, the ID of that notice must be saved to the browser's `localStorage`.
- **R-2.3.2**: Before displaying the list, the application must check `localStorage` and filter out any notices that have been marked as hidden.

### 2.4. UI Handling
- **R-2.4.1**: If there are no notices to display after filtering, the entire notice list component (`div`) should not be rendered.

### 2.5. Read Status Management (New)
- **R-2.5.1**: When a user views the details of a notice, its ID must be marked as 'read' and stored in `localStorage`.
- **R-2.5.2**: When rendering the notice list, the 'read' status of each notice must be passed as a prop to the `NoticeCard` component.

---

## 3. Notice Card (`NoticeCard.tsx`)

### 3.1. Visual Elements
- **R-3.1.1**: A `Badge` with a specific style (color, text) must be displayed according to the `notice_type`.
    - **'점검' (Maintenance), '장애' (Outage)**: `destructive` (red-toned)
    - **'업데이트' (Update)**: `default` (blue-toned)
    - **Other/Unspecified**: `secondary` (gray-toned)
- **R-3.1.2**: If the notice `title` exceeds the card's width, the text must be displayed on a single line and truncated with an ellipsis (...). **The title of an unread notice must be displayed in a bold font.**
- **R-3.1.3**: Visual feedback must be provided when hovering over the card, such as a change in background color.
- **R-3.1.4 (New)**: For unread notices, a discernible green-toned dot marker must be displayed to the right of the title.

### 3.2. User Interaction
- **R-3.2.1**: The entire card area must be clickable, opening the detail modal for the corresponding notice upon click (`onNoticeClick` event).
- **R-3.2.2**: The check icon button on the right side of the card **should only be visible on hover** and must hide the notice when clicked (`onHide` event).
- **R-3.2.3**: The hide button's click event must be prevented from propagating (bubbling) to the card's click event.

### 3.3. Tooltip
- **R-3.3.1**: A tooltip with the text "보관처리" (Archive) must be displayed when hovering over the hide button.
- **R-3.3.2**: The tooltip should only be displayed for the first two times, based on a count stored in `localStorage`. From the third time onwards, the tooltip should not be shown.

---

## 4. Notice Detail Modal (`NoticeDetailModal.tsx`)

### 4.1. Information Display
- **R-4.1.1**: The modal header must include the notice `category badge`, `title`, `publication date`, and `view count`.
- **R-4.1.2**: The publication date (`created_at`) must be formatted and displayed as 'YYYY.MM.DD'.
- **R-4.1.3**: The notice body (`content`) must be rendered as HTML, preserving original line breaks and whitespace.

### 4.2. UI and Usability Features
- **R-4.2.1**: If the notice body content is long, the modal's height should remain fixed, with scrolling enabled only within the content area (`ScrollArea`).
- **R-4.2.2**: The modal window must be closeable by clicking the '확인' (Confirm) button or by clicking the area outside the modal.

---

## 5. State Reset (for Testing)
- **R-5.1.1**: The 'hidden' and 'read' states of notices are stored in the browser's `localStorage` and are therefore persistent.
- **R-5.1.2**: To reset all states for testing purposes, one must execute 'Clear Site Data' from the browser's developer tools. This will delete all related data stored in `localStorage`, returning all notices to their initial state ('unread', 'not hidden'). 