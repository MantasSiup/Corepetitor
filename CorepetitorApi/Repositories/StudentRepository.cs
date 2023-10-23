using CorepetitorApi.Models;
using CorepetitorApi.Data;
using Microsoft.EntityFrameworkCore;

namespace CorepetitorApi.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly CorepetitorDbContext _context;

        public StudentRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public List<Student> GetAllStudents(int TutorId, int ModuleId)
        {
            var module = _context.Modules.FirstOrDefault(m => m.TutorId == TutorId && m.Id == ModuleId);

            if (module == null)
            {
                return new List<Student>();
            }

            var students = _context.Students.Where(st => st.StudentModules.Any(sm => sm.ModuleId == module.Id)).ToList();

            return students;
        }

        public void AddStudent(int TutorId, int ModuleId, Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();

            var module = _context.Modules.FirstOrDefault(m => m.Id == ModuleId && m.TutorId == TutorId);
            if (module == null)
            {
                throw new Exception("Module not found or doesn't belong to the specified tutor.");
            }

            var studentModule = new StudentModule
            {
                StudentId = student.Id,
                ModuleId = ModuleId
            };

            _context.StudentModules.Add(studentModule);
            _context.SaveChanges();
        }

        public void UpdateStudent(int TutorId, int ModuleId, Student student)
        {
            _context.Students.Update(student);

            var module = _context.Modules.FirstOrDefault(m => m.Id == ModuleId && m.TutorId == TutorId);
            if (module == null)
            {
                throw new Exception("Module not found or doesn't belong to the specified tutor.");
            }

            var studentModule = _context.StudentModules.FirstOrDefault(sm => sm.StudentId == student.Id && sm.ModuleId == ModuleId);
            if (studentModule == null)
            {
                studentModule = new StudentModule
                {
                    StudentId = student.Id,
                    ModuleId = ModuleId
                };
                _context.StudentModules.Add(studentModule);
            }

            _context.SaveChanges();
        }

        public void DeleteStudent(int TutorId, int ModuleId, int id)
        {
            var student = _context.Students.Find(id);

            if (student == null)
            {
                throw new Exception("Student not found.");
            }

            var module = _context.Modules.FirstOrDefault(m => m.Id == ModuleId && m.TutorId == TutorId);
            if (module == null)
            {
                throw new Exception("Module not found or doesn't belong to the specified tutor.");
            }

            var studentModule = _context.StudentModules.FirstOrDefault(sm => sm.StudentId == id && sm.ModuleId == ModuleId);
            if (studentModule == null)
            {
                throw new Exception("Student is not associated with the specified module.");
            }

            _context.StudentModules.Remove(studentModule);

            _context.Students.Remove(student);

            _context.SaveChanges();
        }

        Student IStudentRepository.GetStudentById(int TutorId, int ModuleId, int id)
        {
            var module = _context.Modules.FirstOrDefault(m => m.TutorId == TutorId && m.Id == ModuleId);

            if (module == null)
            {
                return null;
            }
            return _context.Students.Where(st => st.StudentModules.Any(sm => sm.ModuleId == module.Id && sm.StudentId == id)).FirstOrDefault();
        }
    }
}
