const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

/* ===================== MongoDB Connection ===================== */
mongoose.connect("mongodb+srv://schooladmin:MyschoolmsP@schoolmanagementdb.0vzixzf.mongodb.net/OSMS?appName=SchoolManagementDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

/* ===================== SCHEMAS ===================== */

// School
const schoolSchema = new mongoose.Schema({
  schoolName: String,
  address: String,
  contact: String,
  email: String,
  principal: String
});

// Student
const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  std: String,
  address: String,
  skills: [String],
  photo: String,
    gender: String,  
  roll: Number 
});
// Faculty
const facultySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  subject: [String],
  address: String,
  skills: [String],
  photo: String
});
// Attendance
const attendanceSchema = new mongoose.Schema({
  class: String,
  division: String,
  roll: Number,
  name: String,
  status: String,
  faculty: String
});

// Marks
const marksSchema = new mongoose.Schema({
  class: String,
  division: String,
  roll: Number,
  name: String,
  math: Number,
  science: Number,
  english: Number
});
const feesSchema = new mongoose.Schema({
  fullName: String,
  std: String,
  rollNo: String,
  totalFees: Number,
  paidFees: Number,
  date: String,
  time: String,
  method: String
});




// ✅ Contact (NEW)
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String
});

/* ===================== MODELS ===================== */

const School = mongoose.model("School", schoolSchema);
const Student = mongoose.model("Student", studentSchema);
const Faculty = mongoose.model("Faculty", facultySchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Marks = mongoose.model("Marks", marksSchema);
const Fees = mongoose.model("Fees", feesSchema);
const Contact = mongoose.model("Contact", contactSchema);

/* ===================== APIs ===================== */

// School
app.post("/register-school", async (req, res) => {
  try {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.send("✅ School Registered");
  } catch (err) {
    res.status(500).send(err);
  }
});

// Student
app.post("/addStudent", async (req, res) => {
  console.log("👉 DATA RECEIVED:", req.body);
  const student = new Student(req.body);
  await student.save();
  res.send("✅ Student Saved");
});

app.get("/students", async (req, res) => {
  const data = await Student.find();
  res.json(data);
});

// Faculty
app.post("/addFaculty", async (req, res) => {
  try {
    const { name, email, phone, password, subject, address, skills } = req.body;

    // ✅ Validation
    if (!name || !email || !phone || !password || !subject || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Duplicate email check
    const existing = await Faculty.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const faculty = new Faculty({
      name,
      email,
      phone,
      password,
      subject,
      address,
      skills
    });

    await faculty.save();
    res.status(201).json({ message: "✅ Faculty Saved", faculty });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/faculty", async (req, res) => {
  const data = await Faculty.find();
  res.json(data);
});

// Attendance
app.post("/addAttendance", async (req, res) => {
  const attendance = new Attendance(req.body);
  await attendance.save();
  res.send("✅ Attendance Saved");
});

app.get("/attendance", async (req, res) => {
  const data = await Attendance.find();
  res.json(data);
});
const syllabusSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  date: String,
  faculty: String,
  pdf: String 
});

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

app.post("/addSyllabus", async (req, res) => {
  const data = new Syllabus(req.body);
  await data.save();
  res.send("✅ Syllabus Added");
});
// Marks
app.post("/addMarks", async (req, res) => {
  const marks = new Marks(req.body);
  await marks.save();
  res.send("✅ Marks Saved");
});

app.get("/marks", async (req, res) => {
  const data = await Marks.find();
  res.json(data);
});

// Fees
app.post("/addFees", async (req, res) => {
  const data = new Fees(req.body);
  await data.save();
  res.send("✅ Fees Saved");
});

app.get("/fees", async (req, res) => {
  const data = await Fees.find();
  res.json(data);
});

app.delete("/deleteFees/:id", async (req, res) => {
  await Fees.findByIdAndDelete(req.params.id);
  res.send("✅ Fees Deleted");
});

app.put("/updateFees/:id", async (req, res) => {
  await Fees.findByIdAndUpdate(req.params.id, req.body);
  res.send("✅ Fees Updated");
});
app.get("/syllabus", async (req, res) => {
  const data = await Syllabus.find();
  res.json(data);
});
// ================= CONTACT (NEW) =================
app.post("/contact", async (req, res) => {
  try {
    console.log("👉 Contact Data:", req.body);

    const newContact = new Contact(req.body);
    await newContact.save();

    res.send("✅ Contact Submitted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET CONTACT DATA (optional)
app.get("/contacts", async (req, res) => {
  const data = await Contact.find();
  res.json(data);
});

/* ===================== DELETE & UPDATE ===================== */

// Student
app.delete("/deleteStudent/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.send("✅ Student Deleted");
});

app.put("/updateStudent/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.send("✅ Student Updated");
});

// Faculty
app.delete("/deleteFaculty/:id", async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  res.send("✅ Faculty Deleted");
});

app.put("/updateFaculty/:id", async (req, res) => {
  await Faculty.findByIdAndUpdate(req.params.id, req.body);
  res.send("✅ Faculty Updated");
});

// Attendance
app.delete("/deleteAttendance/:id", async (req, res) => {
  await Attendance.findByIdAndDelete(req.params.id);
  res.send("✅ Attendance Deleted");
});

app.put("/updateAttendance/:id", async (req, res) => {
  await Attendance.findByIdAndUpdate(req.params.id, req.body);
  res.send("✅ Attendance Updated");
});


// DELETE SYLLABUS
app.delete("/deleteSyllabus/:id", async (req, res) => {
  await Syllabus.findByIdAndDelete(req.params.id);
  res.send("✅ Syllabus Deleted");
});

// UPDATE SYLLABUS
app.put("/updateSyllabus/:id", async (req, res) => {
  await Syllabus.findByIdAndUpdate(req.params.id, req.body);
  res.send("✅ Syllabus Updated");
});
/* ===================== WEBSITE PAGES ===================== */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contact.html"));
});

app.get("/features", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "features.html"));
});

app.get("/receipt", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "receipt.html"));
});

app.get("/status", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "status.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});


/* ===================== DASHBOARDS ===================== */

app.get("/admin-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin-dashboard.html"));
});

app.get("/student-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "student-dashboard.html"));
});

app.get("/faculty-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "faculty-dashboard.html"));
});



app.get("/student-management", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "student-management.html"));
});

app.get("/faculty-management", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "faculty-management.html"));
});

app.get("/fees-management", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "fees-management.html"));
});

app.get("/attendance-management", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "attendance-management.html"));
});
/* ===================== LOGIN ===================== */
const studentUsers = [
  { name: "mina", email: "mina@gmail.com", password: "123", roll: 1, class: 9 },
  { name: "rita", email: "rita@gmail.com", password: "123", roll: 2, class: 9 },
  { name: "rahul", email: "rahul@gmail.com", password: "123", roll: 3, class: 10 },
  { name: "neha", email: "neha@gmail.com", password: "123", roll: 4, class: 10 },
  { name: "aman", email: "aman@gmail.com", password: "123", roll: 5, class: 8 },
  { name: "pooja", email: "pooja@gmail.com", password: "123", roll: 6, class: 8 },
  { name: "karan", email: "karan@gmail.com", password: "123", roll: 7, class: 9 },
  { name: "riya", email: "riya@gmail.com", password: "123", roll: 8, class: 10 },
  { name: "vikas", email: "vikas@gmail.com", password: "123", roll: 9, class: 7 },
  { name: "sonal", email: "sonal@gmail.com", password: "123", roll: 10, class: 7 }
];

app.post("/login", (req, res) => {
  const { role, name, password } = req.body;

  if (role === "Student") {
    let user = studentUsers.find(
      s => s.name === name && s.password === password
    );
if (!user) {
  return res.status(401).send("❌ Invalid Login");
}
    return res.json(user);
  }

  if (role === "Admin") {
    return res.send("/admin-dashboard.html");
  }

  if (role === "Faculty") {
    return res.send("/faculty-dashboard.html");
  }

  res.send("❌ Invalid Login");
});
/* ===================== SERVER ===================== */

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});