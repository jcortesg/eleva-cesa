
# Project Blueprint

## Overview

This document outlines the plan for adding user and donation management functionality to the admin section of the application.

## Implemented Features

### Internationalization and Formatting

*   **Spanish Translations:** Created a `translations.ts` file to store Spanish translations for various UI elements, including donation statuses.
*   **Currency Formatting:** Implemented a `currency.ts` utility to format numerical amounts into Colombian Pesos (COP).

### Status Labels

*   **StatusLabel Component:** Created a reusable `StatusLabel` component to display the status of a donation with a visually distinct style (color-coded labels).

### Donation Table

*   **Date Column:** Added a "Date" column to the donations table on the `/admin-donations/donations` page to display the creation date of each donation.
*   **Status Display:** Integrated the `StatusLabel` component to provide a clearer visual representation of the donation status.
*   **Internationalization:** Applied Spanish translations and COP currency formatting to the table data.

### Donation Details Modal

*   **Two-Column Layout:** Redesigned the donation modal to use a two-column grid layout, improving readability.
*   **Modal Component:** Created a reusable `DonationModal` component to display detailed information about a single donation.
*   **Modal Integration:** Integrated the modal into the `/admin-donations/donations` page.
*   **Interactivity:** Implemented click handlers to show the modal when a donation row is clicked and a close button to hide it.
*   **Styling:** Added CSS to style the modal for a clean and professional appearance, including a backdrop overlay.
*   **Status Display:** Integrated the `StatusLabel` component within the modal.
*   **Internationalization:** Applied Spanish translations and COP currency formatting.

### Admin Dashboard

*   **Dashboard Page:** Created a new dashboard page at `/admin-donations`.
*   **Donation Summary:** Displays the total amount of donations received.
*   **Donations by Status:** Shows a breakdown of donations by their current status, now using translated status names.
*   **Donations Chart:** Includes a bar chart that visualizes the donation amounts over the last 30 days.
*   **Dependencies:** Installed and integrated the `recharts` library for data visualization.
*   **Internationalization:** Applied Spanish translations and COP currency formatting to the dashboard metrics and charts.

### User and Donation Management

*   **Admin Section:** Created a new section at `/admin-donations`.
*   **User Management:**
    *   Created a page at `/admin-donations/users` to display a list of users from Firestore.
    *   **Enhanced Styling:** Applied a modern and professional design to the user table and creation modal, improving readability and user experience.
    *   Implemented server-side actions to fetch user data.
    *   **User Creation as a Modal:**
        *   Replaced the separate user creation page with a modal on the `/admin-donations/users` page for a more streamlined user experience.
        *   Created a `CreateUserModal.tsx` component with a modern, styled form.
        *   Added a "Crear Usuario" button to the user list page that opens the modal.
        *   The user list now automatically refreshes upon successful user creation.
    *   **Server Action Refactoring:** Consolidated the `createUser` server action into the main `actions.ts` file for the `users` route.
*   **Donation Management:**
    *   Created a page at `/admin-donations/donations` to display a list of donations from Firestore.
    *   Implemented server-side actions to fetch donation data.
*   **Admin Layout:**
    *   Created a layout for the admin section with navigation to the dashboard, user, and donation pages.
    *   Added CSS to style the admin section for a more professional look and feel.

## Current Plan

*   This milestone is complete. The next step is to await further instructions.
