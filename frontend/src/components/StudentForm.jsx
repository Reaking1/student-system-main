import { useState } from "react"
import { registerStudent } from "../services/studentService";
import './StudentForm.css'

const StudentForm = ({ onSuccess}) => {
    const [fullname, setFullName] = useState("");
    const [studentId, setStudentId] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [courseId, setCourseId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error,setErorr] = useState(false);


    const handleSubmit = async (e) => {
        e.prevenrtDefault();
        setLoading(true);
        setErorr(null);

        try {
            await registerStudent({
                full_name: fullname,
                student_id: studentId,
                email,
                dob,
                course_id: courseId
            });
            setFullName("");
            setStudentId("");
            setEmail("");
            setDob("");
            setCourseId("");
            if(onSuccess) onSuccess();
        } catch (err) {
            setErorr(err.message || "Failed to create student");
        } finally {
            setLoading(false)
        }
    };

    return (
         <div className="student-form">
      <h2>Add Student</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <label>
          Student ID
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Date of Birth
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </label>

        <label>
          Course ID
          <input
            type="number"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>
    </div>
    )
}


export default StudentForm;