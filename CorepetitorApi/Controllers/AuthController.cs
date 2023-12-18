using CorepetitorApi.Helper;
using CorepetitorApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Dtos;

namespace CorepetitorApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly AuthRepository _authRepository;
        private readonly AuthHelper authHelper;

        public AuthController(ILogger<AuthController> logger, AuthRepository authRepository, IConfiguration config)
        {
            _logger = logger;
            _authRepository = authRepository;
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
    }
}