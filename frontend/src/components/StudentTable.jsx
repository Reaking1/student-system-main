import { useEffect, useState } from "react"
import { deleteStudent, getStudentById } from "../services/studentService";
import './StudentTable.css'


const StudentTable = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await getStudentById();
            setStudents(data);
        } catch (err) {
            setError(err.message || "Failed to fetch students");

        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        fetchStudents()
    }, []);


    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this student")) return;

        try {
            await deleteStudent(id);
            setStudents((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            alert(err.message || "Failed to delete student");
        }
    };

    const handleReport = (id) => {
        //Open report PDF in a new tab
          window.open(`http://localhost/student-system/backend/api/reports/profile_report.php?student_id=${id}`, "_blank");
  };
    

    if (loading) return <p>Loading students...</p>;
    if(error) return <p className="error">{error}</p>


    return(
         <div className="student-table">
      <h2>Students</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.student_id}</td>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.course_id}</td>
                <td>
                  <button onClick={() => handleReport(student.id)}>Report</button>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
    

}

export default StudentTable;