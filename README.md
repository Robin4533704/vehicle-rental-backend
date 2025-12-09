# Vehicle Rental Management System

**Live URL:** [http://localhost:5000](http://localhost:5000)  

---

## Features

- **User Management:** Admin can create, update, delete, and view users. Customers can update their own profile.  
- **Vehicle Management:** Admin can add, update, delete, and view vehicles.  
- **Booking System:** Customers can book vehicles for specific dates. Admin can view all bookings.  
- **Authentication & Authorization:** JWT-based login with role-based access control (Admin, Customer).  
- **Validation & Error Handling:** Ensures invalid data or unauthorized actions are handled gracefully.  

---

## Technology Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL  
- **Authentication:** JWT (JSON Web Tokens)  
- **Middleware:** Custom auth & admin middlewares  
- **Other Tools:** dotenv for environment variables, pg for PostgreSQL integration, Postman for testing APIs  

---

## Setup & Usage

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vehicle-rental-backend.git
cd vehicle-rental-backend
