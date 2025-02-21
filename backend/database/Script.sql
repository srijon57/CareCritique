CREATE TABLE UserAccount (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    UserType ENUM('Patient', 'Doctor', 'Admin') NOT NULL
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
    Area VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
CREATE TABLE Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);
CREATE TABLE Doctor (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    HospitalID INT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    Gender ENUM('Male', 'Female', 'Other'),
    ContactNumber VARCHAR(15),
    Specialty VARCHAR(255),
    Education TEXT,
    Hospital VARCHAR(255),
    Experience TEXT,
    Languages TEXT,
    Availability TEXT,
    Biography TEXT,
    CertificatePath1 VARCHAR(255),
    CertificatePath2 VARCHAR(255),
    CertificatePath3 VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES UserAccount(UserID)
);

CREATE TABLE Hospital (
    HospitalID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255),
    ContactNumber VARCHAR(15),
    HospitalArea VARCHAR(255),
    HospitalCity VARCHAR(255)                                                  
);

CREATE TABLE Appointment (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    Date DATE,
    Time TIME,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);

CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    Rating INT CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID)
);
CREATE TABLE Location (
    LocationID INT AUTO_INCREMENT PRIMARY KEY,
    Area VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL
);

ALTER TABLE UserAccount
ADD COLUMN verified BOOLEAN DEFAULT FALSE;
ALTER TABLE UserAccount
ADD COLUMN otp_expires_at TIMESTAMP NULL AFTER verified;

INSERT INTO UserAccount (Email, PasswordHash, UserType, verified)
VALUES ('admin@example.com', 'hashed_password_here', 'Admin', TRUE);

INSERT INTO Admin (UserID, FirstName, LastName)
VALUES (LAST_INSERT_ID(), 'Admin', 'User');


INSERT INTO Hospital (Name, Address, ContactNumber, HospitalArea, HospitalCity) VALUES
('Square Hospital', '18/F Bir Uttam Qazi Nuruzzaman Rd, Dhaka 1205', '01713141414', 'Panthapath', 'Dhaka'),
('United Hospital', 'Plot 15, Road 71, Gulshan-2, Dhaka 1212', '01711990000', 'Gulshan', 'Dhaka'),
('Apollo Hospital', 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', '01715055555', 'Bashundhara', 'Dhaka'),
('Labaid Hospital', 'House 06, Road 04, Dhanmondi, Dhaka 1205', '01713456789', 'Dhanmondi', 'Dhaka'),
('Ibn Sina Hospital', 'House 48, Road 9/A, Dhanmondi, Dhaka 1209', '01711223344', 'Dhanmondi', 'Dhaka'),
('Popular Hospital', 'House 16, Road 2, Dhanmondi, Dhaka 1205', '01715678901', 'Dhanmondi', 'Dhaka'),
('Evercare Hospital', 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', '01922334455', 'Bashundhara', 'Dhaka'),
('Dhaka Medical College Hospital', 'Secretariat Road, Dhaka 1000', '01712345678', 'Secretariat Road', 'Dhaka'),
('Holy Family Red Crescent Medical College Hospital', '1 Eskaton Garden Rd, Dhaka 1000', '01819234567', 'Eskaton', 'Dhaka'),
('Bangabandhu Sheikh Mujib Medical University', 'Shahbagh, Dhaka 1000', '01711334455', 'Shahbagh', 'Dhaka');

SELECT * FROM Doctor;
SELECT * FROM UserAccount;
SELECT * FROM Patient;
SELECT * FROM Hospital;
SELECT * FROM Admin;
SELECT * FROM Appointment;
SELECT * FROM Reviews;
