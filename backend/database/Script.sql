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

INSERT INTO UserAccount (Email, PasswordHash, UserType, verified) VALUES
('dr.kamal@example.com', 'hashed_password1', 'Doctor', TRUE),
('dr.nazneen@example.com', 'hashed_password2', 'Doctor', TRUE),
('dr.raihan@example.com', 'hashed_password3', 'Doctor', TRUE),
('dr.tasnim@example.com', 'hashed_password4', 'Doctor', TRUE);


INSERT INTO Doctor (UserID, HospitalID, FirstName, LastName, Address, Gender, ContactNumber, Specialty, Education, Hospital, Experience, Languages, Availability, Biography, CertificatePath1, CertificatePath2, CertificatePath3)
VALUES  
((SELECT UserID FROM UserAccount WHERE Email = 'dr.kamal@example.com'), 1, 'Kamal', 'Hossain', 'House-10, Road-5, Dhanmondi, Dhaka', 'Male', '01711111111', 'Cardiologist', 'MBBS, FCPS (Cardiology)', 'Square Hospital', '15 years in cardiology', 'Bengali, English', 'Sun-Thu 9AM-4PM', 'Experienced in interventional cardiology and heart diseases.', 'certificates/kamal1.pdf', NULL, NULL),  

((SELECT UserID FROM UserAccount WHERE Email = 'dr.nazneen@example.com'), 2, 'Nazneen', 'Akter', 'House-22, Road-7, Gulshan, Dhaka', 'Female', '01722222222', 'Gynecologist', 'MBBS, MS (Gynecology)', 'United Hospital', '12 years in obstetrics and gynecology', 'Bengali, English', 'Mon-Fri 10AM-5PM', 'Specialist in maternal health and fertility treatments.', 'certificates/nazneen1.pdf', 'certificates/nazneen2.pdf', NULL),  

((SELECT UserID FROM UserAccount WHERE Email = 'dr.raihan@example.com'), 3, 'Raihan', 'Islam', 'House-8, Block-B, Bashundhara, Dhaka', 'Male', '01733333333', 'Neurologist', 'MBBS, MD (Neurology)', 'Apollo Hospital', '10 years in neurology', 'Bengali, English', 'Sat-Wed 8AM-3PM', 'Expert in treating stroke, epilepsy, and nerve disorders.', 'certificates/raihan1.pdf', 'certificates/raihan2.pdf', 'certificates/raihan3.pdf'),  

((SELECT UserID FROM UserAccount WHERE Email = 'dr.tasnim@example.com'), 4, 'Tasnim', 'Rahman', 'House-15, Road-3, Dhanmondi, Dhaka', 'Female', '01744444444', 'Orthopedic Surgeon', 'MBBS, MS (Orthopedics)', 'Labaid Hospital', '8 years in orthopedic surgery', 'Bengali, English, Hindi', 'Sun-Thu 9AM-6PM', 'Specialist in joint replacements and spinal surgeries.', 'certificates/tasnim1.pdf', NULL, NULL);

CREATE OR REPLACE VIEW CardiologistInDhaka AS
SELECT 
    d.DoctorID, 
    d.FirstName, 
    d.LastName, 
    d.Specialty, 
    d.HospitalID, 
    h.Name AS HospitalName, 
    h.HospitalCity
FROM 
    Doctor d
JOIN 
    Hospital h ON d.HospitalID = h.HospitalID
WHERE 
    d.Specialty = 'Cardiologist'
    AND h.HospitalCity = 'Dhaka';
CREATE TABLE Reviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES Doctor(DoctorID) ON DELETE CASCADE
);
ALTER TABLE Doctor
ADD COLUMN verified INT DEFAULT 0;
UPDATE UserAccount
SET UserType = 'Admin'
WHERE UserID=14;

CREATE TRIGGER prevent_duplicate_reviews
BEFORE INSERT ON Reviews
FOR EACH ROW
BEGIN
    IF (SELECT COUNT(*) FROM Reviews WHERE PatientID = NEW.PatientID AND DoctorID = NEW.DoctorID) > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A patient can only leave one review per doctor.';
    END IF;
END;


CREATE PROCEDURE GetDoctorDetails(IN doctorID INT)
BEGIN
    SELECT * FROM Doctor WHERE DoctorID = doctorID;
END;
CALL GetDoctorDetails(30);

CREATE PROCEDURE GetDoctorsByMiddleLetters(IN middlePart VARCHAR(255))
BEGIN
    SELECT * FROM Doctor WHERE FirstName LIKE CONCAT('%', middlePart, '%');
end

CALL GetDoctorsByMiddleLetters('ri');

CREATE PROCEDURE GetDoctorsByLastLetter(IN suffix VARCHAR(255))
BEGIN
    SELECT * FROM Doctor WHERE FirstName LIKE CONCAT('%', suffix);
END

CALL GetDoctorsByLastLetter('h');

CREATE PROCEDURE GetDoctorsByFirstLetter(IN prefix VARCHAR(255))
BEGIN
    SELECT * FROM Doctor WHERE FirstName LIKE CONCAT(prefix, '%');
end

CALL GetDoctorsByFirstLetter('A');

CREATE PROCEDURE GetDoctorAverageRating(doctorID INT)
BEGIN
    SELECT 
        d.FirstName, 
        d.LastName, 
        d.Specialty, 
        AVG(r.Rating) AS AverageRating, 
        COUNT(r.ReviewID) AS TotalReviews
    FROM Doctor d
    JOIN Reviews r ON d.DoctorID = r.DoctorID
    WHERE d.DoctorID = doctorID
    GROUP BY d.FirstName, d.LastName, d.Specialty;
END 

call GetDoctorAverageRating(31);

SELECT * FROM Doctor;
SELECT * FROM UserAccount;
SELECT * FROM Patient;
SELECT * FROM Hospital;
SELECT * FROM Admin;
SELECT * FROM Appointment;
SELECT * FROM Reviews;
ALTER TABLE Doctor ADD COLUMN ProfilePicture VARCHAR(255) NULL;
INSERT INTO UserAccount (Email, PasswordHash, UserType, verified) VALUES
('patient1@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient2@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient3@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient4@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient5@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient6@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient7@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient8@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient9@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient10@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient11@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE),
('patient12@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Patient', TRUE);

INSERT INTO Patient (UserID, FirstName, LastName, Address, BloodGroup, Gender, ContactNumber, City, Area) VALUES
((SELECT UserID FROM UserAccount WHERE Email = 'patient1@example.com'), 'Rahim', 'Uddin', 'House-1, Road-1, Dhaka', 'A+', 'Male', '01711111112', 'Dhaka', 'Dhanmondi'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient2@example.com'), 'Karim', 'Ahmed', 'House-2, Road-2, Dhaka', 'B+', 'Male', '01711111113', 'Dhaka', 'Gulshan'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient3@example.com'), 'Sultana', 'Begum', 'House-3, Road-3, Dhaka', 'O+', 'Female', '01711111114', 'Dhaka', 'Banani'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient4@example.com'), 'Jamal', 'Hossain', 'House-4, Road-4, Dhaka', 'AB+', 'Male', '01711111115', 'Dhaka', 'Mohammadpur'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient5@example.com'), 'Ayesha', 'Khatun', 'House-5, Road-5, Dhaka', 'A-', 'Female', '01711111116', 'Dhaka', 'Mirpur'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient6@example.com'), 'Farhan', 'Rahman', 'House-6, Road-6, Dhaka', 'B-', 'Male', '01711111117', 'Dhaka', 'Uttara'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient7@example.com'), 'Nusrat', 'Jahan', 'House-7, Road-7, Dhaka', 'O-', 'Female', '01711111118', 'Dhaka', 'Bashundhara'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient8@example.com'), 'Shakib', 'Khan', 'House-8, Road-8, Dhaka', 'AB-', 'Male', '01711111119', 'Dhaka', 'Motijheel'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient9@example.com'), 'Tania', 'Akter', 'House-9, Road-9, Dhaka', 'A+', 'Female', '01711111120', 'Dhaka', 'Panthapath'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient10@example.com'), 'Rubel', 'Mia', 'House-10, Road-10, Dhaka', 'B+', 'Male', '01711111121', 'Dhaka', 'Dhanmondi'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient11@example.com'), 'Mina', 'Begum', 'House-11, Road-11, Dhaka', 'O+', 'Female', '01711111122', 'Dhaka', 'Gulshan'),
((SELECT UserID FROM UserAccount WHERE Email = 'patient12@example.com'), 'Sabbir', 'Hossain', 'House-12, Road-12, Dhaka', 'AB+', 'Male', '01711111123', 'Dhaka', 'Banani');
INSERT INTO UserAccount (Email, PasswordHash, UserType, verified) VALUES
('dr.arif@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.farhana@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.sajid@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.tahmina@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.shahid@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.nadia@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.rafiq@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.sumaiya@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.imran@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.farzana@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.jamil@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.sharmin@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.masud@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.sabina@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.kabir@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.meher@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.salim@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.nargis@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.akram@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.rina@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE),
('dr.faisal@example.com', '$2y$10$eSA/4E6KhO0OpnrvTxlCuu9hGYRnsshgYR9TPqmmaN0hD2AVuQ3Zq', 'Doctor', TRUE);

INSERT INTO Doctor (UserID, HospitalID, FirstName, LastName, Address, Gender, ContactNumber, Specialty, Education, Hospital, Experience, Languages, Availability, Biography, CertificatePath1, CertificatePath2, CertificatePath3) VALUES
((SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com'), 5, 'Arif', 'Hossain', 'House-13, Road-13, Dhaka', 'Male', '01711111124', 'Cardiologist', 'MBBS, FCPS (Cardiology)', 'Ibn Sina Hospital', '10 years in cardiology', 'Bengali, English', 'Mon-Fri 9AM-5PM', 'Experienced in cardiac interventions.', 'certificates/arif1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.farhana@example.com'), 6, 'Farhana', 'Akter', 'House-14, Road-14, Dhaka', 'Female', '01711111125', 'Cardiologist', 'MBBS, FCPS (Cardiology)', 'Popular Hospital', '8 years in cardiology', 'Bengali, English', 'Tue-Sat 10AM-6PM', 'Specialist in heart failure management.', 'certificates/farhana1.pdf', 'certificates/farhana2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.sajid@example.com'), 7, 'Sajid', 'Khan', 'House-15, Road-15, Dhaka', 'Male', '01711111126', 'Cardiologist', 'MBBS, FCPS (Cardiology)', 'Evercare Hospital', '12 years in cardiology', 'Bengali, English', 'Sun-Thu 8AM-4PM', 'Expert in interventional cardiology.', 'certificates/sajid1.pdf', 'certificates/sajid2.pdf', 'certificates/sajid3.pdf'),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.tahmina@example.com'), 8, 'Tahmina', 'Begum', 'House-16, Road-16, Dhaka', 'Female', '01711111127', 'Gynecologist', 'MBBS, MS (Gynecology)', 'Dhaka Medical College Hospital', '9 years in obstetrics and gynecology', 'Bengali, English', 'Mon-Fri 9AM-5PM', 'Specialist in high-risk pregnancies.', 'certificates/tahmina1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.shahid@example.com'), 9, 'Shahid', 'Rahman', 'House-17, Road-17, Dhaka', 'Male', '01711111128', 'Neurologist', 'MBBS, MD (Neurology)', 'Holy Family Red Crescent Medical College Hospital', '11 years in neurology', 'Bengali, English', 'Sat-Wed 8AM-3PM', 'Expert in treating epilepsy and stroke.', 'certificates/shahid1.pdf', 'certificates/shahid2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.nadia@example.com'), 10, 'Nadia', 'Jahan', 'House-18, Road-18, Dhaka', 'Female', '01711111129', 'Orthopedic Surgeon', 'MBBS, MS (Orthopedics)', 'Bangabandhu Sheikh Mujib Medical University', '7 years in orthopedic surgery', 'Bengali, English', 'Sun-Thu 9AM-6PM', 'Specialist in joint replacements.', 'certificates/nadia1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.rafiq@example.com'), 1, 'Rafiq', 'Uddin', 'House-19, Road-19, Dhaka', 'Male', '01711111130', 'Dermatologist', 'MBBS, DDV', 'Square Hospital', '10 years in dermatology', 'Bengali, English', 'Mon-Fri 10AM-5PM', 'Specialist in skin diseases and cosmetic dermatology.', 'certificates/rafiq1.pdf', 'certificates/rafiq2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.sumaiya@example.com'), 2, 'Sumaiya', 'Akter', 'House-20, Road-20, Dhaka', 'Female', '01711111131', 'Pediatrician', 'MBBS, DCH', 'United Hospital', '9 years in pediatrics', 'Bengali, English', 'Tue-Sat 9AM-4PM', 'Specialist in child health and vaccinations.', 'certificates/sumaiya1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.imran@example.com'), 3, 'Imran', 'Hossain', 'House-21, Road-21, Dhaka', 'Male', '01711111132', 'Gastroenterologist', 'MBBS, MD (Gastroenterology)', 'Apollo Hospital', '11 years in gastroenterology', 'Bengali, English', 'Sun-Thu 8AM-3PM', 'Expert in digestive disorders.', 'certificates/imran1.pdf', 'certificates/imran2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.farzana@example.com'), 4, 'Farzana', 'Begum', 'House-22, Road-22, Dhaka', 'Female', '01711111133', 'Endocrinologist', 'MBBS, MD (Endocrinology)', 'Labaid Hospital', '8 years in endocrinology', 'Bengali, English', 'Mon-Fri 9AM-5PM', 'Specialist in diabetes and hormonal disorders.', 'certificates/farzana1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.jamil@example.com'), 5, 'Jamil', 'Ahmed', 'House-23, Road-23, Dhaka', 'Male', '01711111134', 'Urologist', 'MBBS, MS (Urology)', 'Ibn Sina Hospital', '10 years in urology', 'Bengali, English', 'Tue-Sat 10AM-6PM', 'Expert in urinary tract disorders.', 'certificates/jamil1.pdf', 'certificates/jamil2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.sharmin@example.com'), 6, 'Sharmin', 'Akter', 'House-24, Road-24, Dhaka', 'Female', '01711111135', 'Ophthalmologist', 'MBBS, DO', 'Popular Hospital', '9 years in ophthalmology', 'Bengali, English', 'Sun-Thu 9AM-4PM', 'Specialist in eye diseases and surgeries.', 'certificates/sharmin1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.masud@example.com'), 7, 'Masud', 'Rahman', 'House-25, Road-25, Dhaka', 'Male', '01711111136', 'ENT Specialist', 'MBBS, MS (ENT)', 'Evercare Hospital', '12 years in ENT', 'Bengali, English', 'Mon-Fri 8AM-3PM', 'Expert in ear, nose, and throat disorders.', 'certificates/masud1.pdf', 'certificates/masud2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.sabina@example.com'), 8, 'Sabina', 'Yasmin', 'House-26, Road-26, Dhaka', 'Female', '01711111137', 'Psychiatrist', 'MBBS, MD (Psychiatry)', 'Dhaka Medical College Hospital', '11 years in psychiatry', 'Bengali, English', 'Sat-Wed 9AM-5PM', 'Specialist in mental health disorders.', 'certificates/sabina1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.kabir@example.com'), 9, 'Kabir', 'Hossain', 'House-27, Road-27, Dhaka', 'Male', '01711111138', 'Oncologist', 'MBBS, MD (Oncology)', 'Holy Family Red Crescent Medical College Hospital', '10 years in oncology', 'Bengali, English', 'Tue-Sat 10AM-6PM', 'Expert in cancer treatment.', 'certificates/kabir1.pdf', 'certificates/kabir2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.meher@example.com'), 10, 'Meher', 'Un Nisa', 'House-28, Road-28, Dhaka', 'Female', '01711111139', 'Rheumatologist', 'MBBS, MD (Rheumatology)', 'Bangabandhu Sheikh Mujib Medical University', '9 years in rheumatology', 'Bengali, English', 'Sun-Thu 9AM-4PM', 'Specialist in arthritis and musculoskeletal disorders.', 'certificates/meher1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.salim@example.com'), 1, 'Salim', 'Khan', 'House-29, Road-29, Dhaka', 'Male', '01711111140', 'Radiologist', 'MBBS, DMRD', 'Square Hospital', '11 years in radiology', 'Bengali, English', 'Mon-Fri 8AM-3PM', 'Expert in medical imaging.', 'certificates/salim1.pdf', 'certificates/salim2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.nargis@example.com'), 2, 'Nargis', 'Akter', 'House-30, Road-30, Dhaka', 'Female', '01711111141', 'Anesthesiologist', 'MBBS, DA', 'United Hospital', '10 years in anesthesiology', 'Bengali, English', 'Tue-Sat 9AM-4PM', 'Specialist in anesthesia and pain management.', 'certificates/nargis1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.akram@example.com'), 3, 'Akram', 'Hossain', 'House-31, Road-31, Dhaka', 'Male', '01711111142', 'General Surgeon', 'MBBS, MS (Surgery)', 'Apollo Hospital', '12 years in surgery', 'Bengali, English', 'Sun-Thu 8AM-3PM', 'Expert in general and laparoscopic surgeries.', 'certificates/akram1.pdf', 'certificates/akram2.pdf', NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.rina@example.com'), 4, 'Rina', 'Begum', 'House-32, Road-32, Dhaka', 'Female', '01711111143', 'Dentist', 'BDS', 'Labaid Hospital', '9 years in dentistry', 'Bengali, English', 'Mon-Fri 9AM-5PM', 'Specialist in dental care and orthodontics.', 'certificates/rina1.pdf', NULL, NULL),
((SELECT UserID FROM UserAccount WHERE Email = 'dr.faisal@example.com'), 5, 'Faisal', 'Ahmed', 'House-33, Road-33, Dhaka', 'Male', '01711111144', 'Physiotherapist', 'BPT', 'Ibn Sina Hospital', '8 years in physiotherapy', 'Bengali, English', 'Tue-Sat 10AM-6PM', 'Expert in rehabilitation and physical therapy.', 'certificates/faisal1.pdf', 'certificates/faisal2.pdf', NULL);
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient1@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')), 5, 'Excellent doctor, very thorough and caring.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient2@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.farhana@example.com')), 4, 'Very knowledgeable and professional.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient3@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.sajid@example.com')), 5, 'Highly recommend, great bedside manner.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient4@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.tahmina@example.com')), 4, 'Very attentive and skilled doctor.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient5@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.shahid@example.com')), 5, 'Excellent care, very satisfied with the treatment.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient6@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.nadia@example.com')), 4, 'Very professional and competent.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient7@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.rafiq@example.com')), 5, 'Highly skilled and caring doctor.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient8@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.sumaiya@example.com')), 4, 'Very thorough and attentive.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient9@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.imran@example.com')), 5, 'Excellent doctor, highly recommend.'),
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient10@example.com')), (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.farzana@example.com')), 4, 'Very knowledgeable and professional.');
-- Review 1
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient1@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')),
 5, 'Dr. Arif is very thorough and explains everything clearly.');

-- Review 2
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient2@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.farhana@example.com')),
 4, 'Dr. Farhana is very professional and attentive.');

-- Review 3
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient3@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.sajid@example.com')),
 5, 'Dr. Sajid is an excellent doctor, highly recommend.');

-- Review 4
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient4@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.tahmina@example.com')),
 4, 'Dr. Tahmina is very skilled and caring.');

-- Review 5
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient5@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.shahid@example.com')),
 5, 'Dr. Shahid provided excellent care and treatment.');

-- Review 6
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient6@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.nadia@example.com')),
 4, 'Dr. Nadia is very competent and professional.');

-- Review 7
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient7@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.rafiq@example.com')),
 5, 'Dr. Rafiq is highly skilled and attentive.');

-- Review 8
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient8@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.sumaiya@example.com')),
 4, 'Dr. Sumaiya is very thorough and caring.');

-- Review 9
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient9@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.imran@example.com')),
 5, 'Dr. Imran is an excellent doctor, highly recommend.');

-- Review 10
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient10@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.farzana@example.com')),
 4, 'Dr. Farzana is very knowledgeable and professional.');
-- Insert reviews for a specific doctor
INSERT INTO Reviews (PatientID, DoctorID, Rating, Comment) VALUES
((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient1@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')),
 5, 'Dr. Arif is very thorough and explains everything clearly.'),

((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient2@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')),
 4, 'I had a great experience. Dr. Arif is very knowledgeable.'),

((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient3@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')),
 5, 'Highly recommend Dr. Arif for his professionalism and care.'),

((SELECT PatientID FROM Patient WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'patient4@example.com')),
 (SELECT DoctorID FROM Doctor WHERE UserID = (SELECT UserID FROM UserAccount WHERE Email = 'dr.arif@example.com')),
 4, 'Very attentive and skilled doctor. Will visit again.');
ALTER TABLE Doctor
ADD COLUMN isVerified BOOLEAN DEFAULT FALSE;
