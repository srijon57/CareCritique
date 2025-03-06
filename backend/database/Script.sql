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
