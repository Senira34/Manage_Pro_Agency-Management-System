# Manage_Pro - Agency Management System

A full-featured Agency Management System built with the MERN stack to streamline credit operations, payment tracking, and route management for distribution agencies.

<img width="200" height="200" alt="localhost_5173_(Low)" src="https://github.com/user-attachments/assets/f0ed3d72-5b24-4af3-b537-0e02cc70c43b" />
<img width="250" height="200" alt="localhost_5173_(High Res) (2)" src="https://github.com/user-attachments/assets/c19f6409-0a27-4704-9f46-ab272f3d0f1f" />
<img width="200" height="200" alt="localhost_5173_(High Res)" src="https://github.com/user-attachments/assets/f7ad7a87-ec0c-4c00-a17a-ba2acbdf26fd" /> <img width="200" height="200" alt="localhost_5173_(High Res) (1)" src="https://github.com/user-attachments/assets/5679c752-e402-480b-8477-cd200206651f" /> <img width="200" height="200" alt="localhost_5173_(High Res) (3)" src="https://github.com/user-attachments/assets/33723315-418b-4eeb-a36b-ba78e362f26c" /> <img width="200" height="200" alt="localhost_5173_(Low) (1)" src="https://github.com/user-attachments/assets/80e39459-d5b6-4837-8ecf-44765d66b230" /> <img width="200" height="200" alt="localhost_5173_(Low) (2)" src="https://github.com/user-attachments/assets/85003a2a-3d85-47e3-a535-133d5be86d8c" /> <img width="200" height="200" alt="localhost_5173_(Low) (3)" src="https://github.com/user-attachments/assets/f533d63e-4177-4011-beb2-69266cafb5b6" /> <img width="200" height="200" alt="localhost_5173_(High Res) (4)" src="https://github.com/user-attachments/assets/8bc6309a-2a7b-4645-a22c-3a72751c1bf2" />


## 🚀 Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt
- Persistent login sessions

### Credit Bill Management
- Create and track credit bills
- Automated invoice number generation

- Route-wise bill organization
- Bill status tracking (Paid/Pending)
- Due date monitoring with overdue alerts

### Cheque Management
- Record cheque payments
- Track cheque status (Pending/Cleared/Bounced)
- Link cheques to specific bills
- Date-based filtering and sorting

### Collection/Payment Tracking
- Record customer payments
- Smart invoice matching system
- Multiple bill payment support
- Automatic balance calculations
- Payment history with timestamps

### Reports & Analytics
- Real-time dashboard with key metrics
- Agency-wise performance summaries
- Paid bills comprehensive report
- Ongoing bills with overdue tracking
- **PDF export functionality** for ongoing bills
- Color-coded status indicators

### User Experience
- Clean, modern UI with Tailwind CSS
- Real-time notifications
- Responsive design for all devices
- Role-based navigation
- Agency and route filtering

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **jsPDF & jspdf-autotable** - PDF generation

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web framework
- **MongoDB** - Database
- **Mongoose 8** - ODM
- **JWT 9** - Authentication
- **bcryptjs** - Password hashing
