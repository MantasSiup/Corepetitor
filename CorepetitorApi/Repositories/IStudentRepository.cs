using System.Collections.Generic;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface IStudentRepository
    {
        List<Student> GetAllStudents(int TutorId, int ModuleId);
        Student GetStudentById(int TutorId, int ModuleId, int id);
        void AddStudent(int TutorId, int ModuleId,Student student);
        void UpdateStudent(int TutorId, int ModuleId, Student student);
        void DeleteStudent(int TutorId, int ModuleId, int id);
    }
}
