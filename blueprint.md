# Eleva Donation App Blueprint

## Overview

This document outlines the blueprint for the Eleva Donation App, a Next.js application designed to facilitate online donations. The application provides a user-friendly donation form, integrates with a payment gateway, and includes features for tracking and managing donations.

## Project Structure

- **/app**: Main application directory.
  - **/api**: API routes for handling donations and payment gateway webhooks.
  - **/(main)**: Main application routes.
    - **/page.tsx**: Donation form page.
    - **/layout.tsx**: Main application layout.
  - **/resultado**: Pages for displaying donation results.
    - **/[reference]**: Dynamic route for displaying the result of a specific donation.
- **/components**: Reusable React components.
  - **DonationForm.tsx**: The main donation form component.
  - **TermsModal.tsx**: Modal for displaying terms and conditions.
- **/domain**: Domain-specific models.
  - **Donation.ts**: The `Donation` interface.
- **/lib**: Utility functions and libraries.
  - **options.ts**: Options for form fields (countries, donation destinations, etc.).
  - **firebase**: Firebase configuration and utility functions.
  - **email.ts**: Functions for sending emails.
- **/styles**: CSS styles for the application.
- **/public**: Public assets (images, logos, etc.).

## Features

- **Donation Form**: A comprehensive form for capturing donation details, including amount, destination, and donor information.
- **Payment Gateway Integration**: Integration with the eCollect payment gateway for processing donations.
- **Donation Tracking**: Each donation is assigned a unique reference for tracking purposes.
- **Donation Result Display**: Users are redirected to a result page after making a donation, which displays the status of their donation.
- **Terms and Conditions**: A modal window displays the terms and conditions that users must accept before making a donation.
- **Automated Thank You Emails**: Upon a successful donation, an automated thank you email is sent to the donor.

## Current Plan

- [x] Fix typo in `src/components/DonationForm.tsx`.
- [x] Run `npm run lint` and fix any issues.
- [x] Delete `next.config.ts`.
- [x] Move `options.ts` to `src/lib`.
- [x] Move `Donation.ts` to `src/domain`.
- [x] Create `blueprint.md` file.
- [x] Implement automated thank you emails for successful donations.
- [x] Update donation amounts to $250.000, $500.000, $1.000.000, and $5.000.000.
- [x] Add donation amounts of $50.000 and $100.000.
