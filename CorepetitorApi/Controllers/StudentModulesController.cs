using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;

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
}