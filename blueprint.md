# Project Blueprint

## Overview

This project is a donation application that allows users to make donations to various causes. It integrates with the eCollect payment gateway to process payments. The application is built with Next.js and uses Firebase for data storage.

## Features

### Donation Form

- A comprehensive donation form that collects user information, donation amount, and destination.
- The form includes fields for personal information, contact details, affiliation, and comments.
- The contact information section includes: Title, First Name, Last Name, ID Type, ID Number, Graduation Year, School, Country, City, Address, Email, Phone, and Mobile.
- Additional options include: joint donation, pledge payment, and employer match.
- The donation form has a modern and visually appealing design, styled with a custom CSS file (`src/app/styles/DonationForm.css`).
- The titles (`h1` and `h2`) on the donation form are styled with the "Inter" font, a size of 23px, and the color #1B41E6.
- The body text of the application has a font size of 13px and a color of #364153.
- The form labels match the body style, with a font size of 13px, color #364153, and normal font weight.
- The form fields have a padding of `0.75rem`.
- The form has a `margin-bottom` of `2rem` on each form group to create more visual separation.
- The contact information section uses a responsive grid layout for better organization.
- Checkbox and radio button labels are vertically centered with their inputs.
- The donation amount is in COP with presets: 250,000, 500,000, 1,000,000, and 5,000,000.
- The "Other" amount has a minimum of 10,000 COP and a maximum of 20,000,000 COP.
- The amount buttons have a background of #F3F4F6 when unselected and #1B41E6 when selected, with no borders.
- The submit button has no border.
- The form provides clear user feedback with a loading spinner during submission and a success message upon completion.

### eCollect Integration

- The application integrates with the eCollect payment gateway to process donations.
- It obtains a session token from eCollect and then creates a transaction payment.
- The user is redirected to the eCollect payment page to complete the donation.

### Firebase Integration

- The application uses Firebase to store donation information.
- A new donation document is created in the `donations` collection for each donation.
- The donation document is updated with the payment ID and payment URL after the transaction is created with eCollect.

## Current Plan

- The latest change was to fix a "400 Bad Request" error that occurred during form submission.
- The error was caused by a mismatch between the data sent by the frontend and the data expected by the backend API.
- The `frequency` section was removed from the donation form, and the corresponding field was removed from the backend validation schema. This simplifies the form and ensures the frontend and backend are aligned.
