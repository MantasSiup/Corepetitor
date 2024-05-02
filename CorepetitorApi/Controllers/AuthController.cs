using CorepetitorApi.Helper;
using CorepetitorApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Dtos;
using CorepetitorApi.Models;
using NuGet.Protocol.Core.Types;

namespace CorepetitorApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly AuthRepository _authRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly AuthHelper authHelper;

        public AuthController(ILogger<AuthController> logger, AuthRepository authRepository, IStudentRepository studentRepository, IConfiguration config)
        {
            _logger = logger;
            _authRepository = authRepository;
            _studentRepository = studentRepository;
            authHelper = new AuthHelper(config);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginData)
        {
            var role = _authRepository.GetUserRole(loginData.Email);
            var userId = 0;
            var password = string.Empty;

            if (role == "student")
            {
                var student =  _authRepository.GetStudent(loginData.Email);

                if (student == null)
                {
                    return NotFound("Account not found.");
                }

                userId = (int)student.Id;
                password = student.Password;
            }
            else if (role == "tutor")
            {
                var tutor =  _authRepository.GetTutor(loginData.Email);

                if (tutor == null)
                {
                    return NotFound("Account not found.");
                }

                userId = (int)tutor.Id;
                password = tutor.Password;
            }
            else if (role == "admin")
            {
                var token = authHelper.GenerateJwtToken(-1, "admin");
                return Created(string.Empty, new { Token = token });
            }

            if (authHelper.DoesPasswordMatch(loginData.Password, password))
            {
                var token = authHelper.GenerateJwtToken(userId, role);
                return Created(string.Empty, new { Token = token });
            }
            return BadRequest();
        }


        [HttpGet("role")]
        public IActionResult GetUserRole([FromQuery] string userEmail)
        {
            var role = _authRepository.GetUserRole(userEmail);
            return Ok(new { role });
        }

        [HttpGet("get-by-email")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public ActionResult<Tutor> GetStudentByEmail([FromQuery] string email)
        {
            var student = _studentRepository.GetStudentByEmail(email);

            if (student == null)
                return NotFound($"Student with email: {email} not found.");

            return Ok(student);
        }
    }
}