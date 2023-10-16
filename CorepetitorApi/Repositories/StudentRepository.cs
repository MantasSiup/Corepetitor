using CorepetitorApi.Models;
using CorepetitorApi.Data;

namespace CorepetitorApi.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly CorepetitorDbContext _context;

        public StudentRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Student> GetAllStudents() => _context.Students.ToList();

        public Student GetStudentById(int id) => _context.Students.Find(id);

        public void AddStudent(Student student)
        {
            _context.Students.Add(student);
            _context.SaveChanges();
        }

        public void UpdateStudent(Student student)
        {
            _context.Students.Update(student);
            _context.SaveChanges();
        }

        public void DeleteStudent(int id)
        {
            var student = _context.Students.Find(id);
            if (student != null)
            {
                _context.Students.Remove(student);
                _context.SaveChanges();
            }
        }
    }
}
