using Microsoft.EntityFrameworkCore;
using CorepetitorApi.Data;
using CorepetitorApi.Dtos;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public class AuthRepository
    {
        private readonly CorepetitorDbContext _context;

        public AuthRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public TutorDto GetTutor(string email)
        {
            return _context.Tutors
                .Where(o => o.Email == email)
                .Select(o => new TutorDto
                {
                    Id = o.Id,
                    Email = o.Email,
                    Password = o.Password
                }).FirstOrDefault();
            
        }

        public StudentDto GetStudent(string email)
        {
            return _context.Students
                .Where(o => o.Email == email)
                .Select(o => new StudentDto
                {
                    Id = o.Id,
                    Email = o.Email,
                    Password = o.Password
                }).FirstOrDefault();
        }

        public string GetUserRole (string email)
        {
            return _context.UserRoles.Where(o => o.Email == email).Select(o => o.Role).FirstOrDefault();
        }
    }
}