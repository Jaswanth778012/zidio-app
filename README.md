# 🌐 Zidio Connect

**Zidio Connect** is a full-stack web application built with **Spring Boot** and **Angular**, designed to be a unified platform for **courses, jobs, and internships**. Whether you're an **admin**, **student**, or **employer**, Zidio Connect streamlines education and career opportunities in one intuitive portal.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.
---
## 🚀 Features Overview

### 👨‍🎓 Student Portal
- 🔹 Browse and enroll in **free or paid courses**
- 🔹 Apply to **jobs and internships**
- 🔹 Track enrolled courses and applications
- 🔹 In-dashboard **messaging** with employers/admin
- 🔹 **Submit reports/issues** directly from dashboard

### 👨‍💼 Employer Portal
- 🔸 **Post and manage** jobs and internships
- 🔸 **Schedule interviews** (auto email to students)
- 🔸 View applicant details and applications
- 🔸 Internal **messaging system**

### 🛠️ Admin Panel
- ✅ **Add and moderate courses** (add syllabus, videos)
- 💳 Integrate **Razorpay** for paid course purchases
- 📩 Approve or reject **job/internship postings**
- 📊 Track reports and analytics (enrollments, issues)
- 📬 Receive **email notifications** on key events
- 🔔 Notification system for all major actions

---

## 🔐 Authentication
- ✅ **Role-based access** (Admin, Student, Employer)
- 🔒 **JWT-secured login**
- 🔃 **Forgot password** & registration flows

---

## 🌍 Pages Overview

| Page            | Description                                          |
|-----------------|------------------------------------------------------|
| **Home**        | Explore courses, internships, and jobs              |
| **Internships** | View & apply to all available internships           |
| **Jobs**        | Browse & apply to listed job openings               |
| **About Us**    | Learn about Zidio Development                       |
| **Contact Us**  | Submit issues or queries (auto-email to admin)      |

---
## 🛠️ Tech Stack

| Layer         | Technology Used                                                                    |
|---------------|------------------------------------------------------------------------------------|
| **Frontend**  | Angular 15+, TypeScript, Angular Material                                          |
| **Styling**   | SCSS, Responsive Design, AOS (Animate on Scroll)                                   |
| **Image Handling** | Cloudinary                                                                    |
| **Backend**   | Spring Boot, Java, Spring Security, JWT                                            |
| **Database**  | MySQL, Hibernate, JPA                                                              |
| **Payment**   | Razorpay Integration                                                               |
| **Email**     | JavaMailSender (SMTP)                                                              |
| **Scheduling**| Google Calendar API + Google Meet                                                  |
| **Auth**      | JWT-based Role-Based Access (Admin, Student, Employer)                             |
---
## 💡 Key Integrations
- ✅ **Razorpay** for paid course enrollment
- 📅 **Google Calendar & Meet** for interview scheduling
- 📤 **Cloudinary** for image upload (team photos, banners,videos etc.)
- 📧 **SMTP Email** for contact, registration, and scheduling
- 🧭 **Netflix Eureka Server** for service discovery and microservices registry
- 💬 **In-dashboard Messaging System** between student, employer, and admin
---

## 📂 Folder Structure (Simplified)

<details> <summary>🖥️ Frontend (Angular)</summary>
frontend/
└── src/
    └── app/
        ├── _auth/
        ├── _model/
        ├── _services/
        ├── about/
        ├── admin/
        ├── contact/
        ├── course-details/
        ├── course-syllabus/
        ├── courses/
        ├── employer/
        ├── footer/
        ├── forbidden/
        ├── header/
        ├── home/
        ├── internship-details/
        ├── internships/
        ├── job-details/
        ├── jobs/
        ├── login/
        ├── message-dialog/
        ├── register/
        ├── remainder-snackbar/
        ├── update-password/
        ├── user/
        ├── app-routing.module.ts
        ├── app.component.ts / .html / .css
        └── app.module.ts
    └── assets/
</details> <details> <summary>⚙️ Backend (Spring Boot)</summary>

Eureka Server/
└── src/
    └── main/
        └── java/
            └── com/example/cloud/
                └── EurekaApplication.java

zidioApp/
└── src/
    └── main/
        └── java/
            └── com/spring/zidio/
                ├── configuration/
                ├── controller/
                ├── dao/
                ├── payload/
                ├── repository/
                ├── service/
                ├── util/
                ├── deserializer/
                ├── Address.java
                ├── AdminNotification.java
                ├── AdminProfile.java
                ├── Application.java
                ├── Interview.java
        └── resources/
            ├── static/               # Static frontend assets (if any)
            ├── templates/            # Thymeleaf or email templates
            ├── application.properties
            └── credentials.json      # Google API credentials (Calendar/Meet)
    └── test/
        └── java/                    # Unit & integration tests
</details> <details> <summary>📦 Root Directory</summary>
zidio-connect/
├── .gitignore
├── .gitattributes
├── mvnw / mvnw.cmd
├── pom.xml
├── package.json
├── angular.json
├── README.md
├── server.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
└── uploads/
</details>

---
## 🧪 How to Run
### Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
---
## 🧪 How to Run

### Frontend(Angular)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

📬 Contact & Support
Developer: pothina venkata sai jaswanth kumar
🌐 LinkedIn: https://www.linkedin.com/in/pothina-jaswanth-kumar-838781249 
If you encounter any issues, reach out via the Contact Us page on the platform. All queries are automatically emailed to the administrator.

