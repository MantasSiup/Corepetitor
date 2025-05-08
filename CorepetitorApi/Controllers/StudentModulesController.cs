using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using CorepetitorApi.Dtos;

[Route("api/[controller]")]
[ApiController]
public class StudentModulesController : ControllerBase
{
    private readonly IModuleRepository _repository;

    public StudentModulesController(IModuleRepository repository)
    {
        _repository = repository;
    }

    // GET: api/StudentModules
    [HttpGet("id")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Module>> GetAllStudentModules(int id)
    {
        return Ok(_repository.GetModulesByStudentId(id));
    }

    [HttpGet("with-tutor")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetModulesWithTutorsForStudent([FromQuery] int studentId)
    {
        var data = _repository.GetStudentModulesWithTutors(studentId)
            .Select(entry => new
            {
                Module = new
                {
                    Id = entry.Module.Id,
                    Name = entry.Module.Name,
                    Description = entry.Module.Description,
                    PricePerHour = entry.Module.PricePerHour,
                    StartDate = entry.Module.StartDate,
                    EndDate = entry.Module.EndDate
                },
                Tutor = entry.Tutor == null ? null : new TutorPublicDto
                {
                    Id = entry.Tutor.Id,
                    Name = entry.Tutor.Name,
                    Email = entry.Tutor.Email,
                    PhoneNumber = entry.Tutor.PhoneNumber,
                    City = entry.Tutor.City
                }
            });

        return Ok(data);
    }

}