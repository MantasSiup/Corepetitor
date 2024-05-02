using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;

[Route("api/[controller]")]
[ApiController]
public class UniqueModulesController : ControllerBase
{
    private readonly IModuleRepository _repository;

    public UniqueModulesController(IModuleRepository repository)
    {
        _repository = repository;
    }

    // GET: api/UniqueModules
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Module>> GetAllUniqueModules()
    {
        return Ok(_repository.GetAllModules());
    }
}
