
#  ![Logo](https://github.com/srijon57/CareCritique/blob/development/carecritique.jpg)
---
<div align="center">
  <h1>CareCritique</h1>
</div>

### Table of Contents:
[Project Description](#project-description) - [Features](#features) - [Objectives](#objectives) - [Target Audience](#target-audience) - [API Endpoints](#api-endpoints) - [Milestones](#milestones) - [Technologies Used](#technologies-used) - [Installation](#installation) - [Team Members](#team) - [Live Project & Mock UI](#lpmui)
- - - -
## 📝 Project Description <a id="project-description"></a>
CareCritique is a community-driven platform designed to review doctors. It allows users to share their experiences, rate doctors, and help others make informed decisions about their healthcare providers. The platform is built using PHP Laravel for the backend, React for the frontend, and MySQL for the database.

## 💡 Project Features <a id="features"></a>

i. **User authentication and authorization**
   - Registration & Login.
   - Admin, Doctor & Patient different login system.

ii. **Doctor profile management**
   - Doctors can update their profiles with relevant information.
   - Patients can view doctor profiles to make informed decisions.

iii. **Details of Doctors and Hospitals**
   - Comprehensive information about doctors and hospitals.
   - Includes specializations, experience, and contact details.

iv. **Review and rating system**
   - Patients can leave reviews and ratings for doctors and hospitals.
   - Reviews can be upvoted or reported for abuse (handled by Admin).

v. **Search and filter functionality**
   - Search for doctors, hospitals, and reviews.
   - Filter results based on various criteria such as specialization, location, and ratings.

vi. **Top hospitals and doctors near user**
   - Geolocation-based search to find top hospitals and doctors nearby.
   - Includes ratings and reviews for better decision-making.

### 🎯 Objectives <a id="objectives"></a>

- **Empower Patients**: Provide a platform where patients can share their experiences and reviews about doctors. 
- **Informed Decisions**: Help users make informed decisions about their healthcare providers based on community feedback. 
- **Transparency**: Increase transparency in the healthcare system by making doctor reviews publicly accessible. 
- **Community Engagement**: Foster a community where users can interact, discuss, and support each other. 

### 👥 Target Audience <a id="target-audience"></a>

- Patients seeking reliable healthcare providers. 
- Doctors looking to improve their services based on patient feedback. 
- Healthcare organizations aiming to enhance their service quality through community insights.

## 📜 API Endpoints <a id="api-endpoints"></a>

### Authentication

- **POST /register**: User registration.
- **POST /login**: User login.

### Doctors

- **GET /doctors**: Fetch all doctors.
- **GET /doctors/{id}**: Fetch a specific doctor's profile.
- **POST /doctors**: Create a new doctor profile (Admin only).
- **PUT /doctors/{id}**: Update a doctor's profile (Doctor or Admin).
- **DELETE /doctors/{id}**: Delete a doctor's profile (Admin only).

### Hospitals

- **GET /hospitals**: Fetch all hospitals.
- **GET /hospitals/{id}**: Fetch a specific hospital's details.
- **POST /hospitals**: Create a new hospital entry (Admin only).
- **PUT /hospitals/{id}**: Update a hospital's details (Admin only).
- **DELETE /hospitals/{id}**: Delete a hospital entry (Admin only).

### Reviews

- **GET /reviews/{doctorId}**: Fetch reviews for a specific doctor.
- **GET /reviews/{hospitalId}**: Fetch reviews for a specific hospital.
- **POST /reviews**: Post a review for a doctor or hospital.
- **PUT /reviews/{id}**: Update a review (User who posted the review).
- **DELETE /reviews/{id}**: Delete a review (User who posted the review or Admin).

### Miscellaneous

- **POST /report**: Report an abusive review or comment.
- **GET /profile**: Fetch user profile details.
- **GET /search**: Search and filter functionality for doctors and hospitals.
- **GET /top**: Fetch top hospitals and doctors near the user.

## 📝 Milestones <a id="milestones"></a>

### Milestone 1: Initial Setup and Basic Features

- [x] Set up backend and frontend.
- [x] Implement user authentication (registration and login).
- [x] Create API endpoints for doctors and hospitals.
- [x] Doctor, Admin & Patient profile.
- [x] Basic UI for login, registration & homepage.

### Milestone 2: Advanced Features and Interactions

- [x] Implement review and rating system.
- [x] Add search and filter functionality.
- [x] Add latest health news 
- [x] UI for review interactions, search functionality & viewing doctor/hospital details.
- [x] Cloudinary implementation for images.

### Milestone 3: Final Touches and Deployment

- [x] Appointment system for patient.
- [x] Implement geolocation-based search for top hospitals and doctors.
- [x] Admin panel for managing doctor verification.
- [x] Complete testing and bug fixes.
- [x] CI pipelining.
- [ ] CD deployment in web.

## 💻 Technologies Used <a id="technologies-used"></a>

-   **Backend**:  <img alt="Laravel" src="https://img.shields.io/badge/-Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white" />
-   **Frontend**:  <img alt="React" src="https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white" />
-   **Database**:  <img alt="MySQL" src="https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" />
-   **Version Control**:  <img alt="Git" src="https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white" />
-   **Repository**:  <img alt="GitHub" src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white" />
- **Rendering Method**:  <img alt="Client-Side Rendering (CSR)" src="https://img.shields.io/badge/-Client--Side%20Rendering%20(CSR)-blue?style=flat-square" />




## 🚧 Installation <a id="installation"></a>

### Prerequisites

- PHP (Laravel) >= 8.4.0
- Composer
- Node.js
- MySQL
- Cloudinary


<details>
<summary>Backend (Laravel)</summary>

1. Clone the repository:
    ```bash
    git clone https://github.com/srijon57/CareCritique.git
    ```
1. Navigate to the backend directory:
    ```bash
    cd ../backend
    ```

3. create a `.env` file with placeholder values.
    ```bash
	APP_NAME=CareCritique
	APP_ENV=local
	APP_KEY= your_app_key
	APP_DEBUG=true
	APP_URL=http://localhost
	FRONTEND_URL=http://localhost:5173
	LOG_LEVEL=debug

	#Database Settings
	DB_CONNECTION=mysql
	DB_HOST=127.0.0.1
	DB_PORT=3306
	DB_DATABASE=your_database_name
	DB_USERNAME=your_database_user
	DB_PASSWORD=your_database_password
	DB_TIMEZONE=+06:00

	#JWT Authentication
	JWT_SECRET=your_jwt_secret

	#Mail Settings
	MAIL_MAILER=smtp
	MAIL_HOST=smtp.gmail.com
	MAIL_PORT=587
	MAIL_USERNAME=your_email@gmail.com
	MAIL_PASSWORD=your_email_password
	MAIL_ENCRYPTION=tls
	MAIL_FROM_ADDRESS="your_email@gmail.com"
	MAIL_FROM_NAME="your mail form name"

	#Cloudinary Settings
	CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
	CLOUDINARY_API_KEY=your_cloudinary_api_key
	CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
4. Install dependencies:
    ```bash
    composer install
    ```

5. Start the Laravel development server:
    ```bash
    php artisan serve
    ```

</details>

<details>
<summary>Frontend (React)</summary>

1. Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the React development server:
    ```bash
    npm run dev
    ```

</details>

## 👷 Team Members <a id="team"></a>

| **ID**       | **Name**                       | **Email**                          | **Github**                          | **Role**             |
|--------------|--------------------------------|------------------------------------|-------------------------------------|----------------------|
| 20220104120  | **Zawad Al Mahi**             | zawadalmahi@gmail.com             | [zawadalmahi](https://github.com/zawadalmahi) | Frontend + Backend  |
| 20220104123  | **Abdullah Al Jubayer**       | abdullahaljubair2019@gmail.com    | [abduillahaljubair](https://github.com/abduillahaljubair) | Frontend + Backend |
| 20220104124  | **KM Hasibur Rahman Srijon**  | srijond57@gmail.com               | [srijon57](https://github.com/srijon57) | Lead                |
| 20210204077  | **Rakibul Islam Rahi**        | rakibulislam.rahi.rir@gmail.com   | [Rakibul-rahi](https://github.com/Rakibul-rahi) | Frontend + Backend |

## ✔️ Live Project & Mock UI <a id="lpmui"></a>

**Mock UI Link**: [FIGMA](https://www.figma.com/design/NNaltjFIKe6KmvpEkPCo8o/CareCritique?node-id=0-1&p=f&t=ecCMGN9Ca10FRsSZ-0)

**Live Project Link**: [VERCEL](https://care-critique.vercel.app/)

`Thank you for supporting us.`
