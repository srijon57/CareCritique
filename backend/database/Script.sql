CREATE TABLE UserAccount (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    UserType ENUM('Patient', 'Doctor', 'Admin') NOT NULL,
);
CREATE TABLE Patient (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    BloodGroup VARCHAR(10),
    Gender ENUM('Male', 'Female', 'Other'),
    ContactNumber VARCHAR(15),
    City VARCHAR(100),
    State VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
CREATE TABLE Doctor (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Address VARCHAR(255),
    BloodGroup VARCHAR(10),
    Gender ENUM('Male', 'Female', 'Other'),
    ContactNumber VARCHAR(15),
    City VARCHAR(100),
    State VARCHAR(100),
    Hospital VARCHAR(255),
    Specialty VARCHAR(255),
    Education TEXT,
    Experience TEXT,
    Languages TEXT,
    Availability TEXT,
    Biography TEXT,
    CertificatePath1 VARCHAR(255),
    CertificatePath2 VARCHAR(255),
    CertificatePath3 VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
INSERT INTO UserAccount (Email, PasswordHash, UserType)
VALUES ('patient@example.com', 'hashed_password', 'Patient');
INSERT INTO UserAccount (Email, PasswordHash, UserType)
VALUES ('doctor@example.com', 'hashed_password', 'Doctor');
INSERT INTO Doctor (UserID, FirstName, LastName, Email, Address, BloodGroup, Gender, ContactNumber, City, State, Hospital, Specialty, Education, Experience, Languages, Availability, Biography, CertificatePath1, CertificatePath2, CertificatePath3)
VALUES (2, 'Jane', 'Smith', 'doctor@example.com', '456 Elm St', 'A+', 'Female', '0987654321', 'Los Angeles', 'CA', 'City Hospital', 'Cardiology', 'MD, PhD', '10 years', 'English, Spanish', 'Mon-Fri 9am-5pm', 'Experienced cardiologist.', '/path/to/cert1.pdf', '/path/to/cert2.pdf', '/path/to/cert3.pdf');
SELECT * FROM Doctor;
SELECT * FROM Patient;
SELECT * FROM Patient;