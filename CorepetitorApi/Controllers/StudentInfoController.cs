using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Models;
using CorepetitorApi.Repositories;
using CorepetitorApi.Dtos;

namespace CorepetitorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentInfoController : ControllerBase
    {
        private readonly IStudentRepository _repository;

        public StudentInfoController(IStudentRepository repository)
        {
            _repository = repository;
        }

        // GET: api/StudentInfo/by-email?email=someone@email.com
        [HttpGet("by-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<StudentPublicDto> GetPublicStudentByEmail([FromQuery] string email)
        {
            var student = _repository.GetStudentByEmail(email);

            if (student == null)
                return NotFound($"Student with email {email} not found.");

            return Ok(new StudentPublicDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                PhoneNumber = student.PhoneNumber,
                Address = student.Address,
                City = student.City
            });
        }
    }
}
