using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class ModulesController : ControllerBase
{
    private readonly IModuleRepository _repository;

    public ModulesController(IModuleRepository repository)
    {
        _repository = repository;
    }

    // GET: api/Modules
    [HttpGet]
    public ActionResult<IEnumerable<Module>> GetAll() => Ok(_repository.GetAllModules());

    // GET: api/Modules/{id}
    [HttpGet("{id}")]
    public ActionResult<Module> Get(int id)
    {
        var module = _repository.GetModuleById(id);
        if (module == null) return NotFound();
        return Ok(module);
    }

    // POST: api/Modules
    [HttpPost]
    public ActionResult<Module> Add(Module module)
    {
        _repository.AddModule(module);
        return CreatedAtAction(nameof(Get), new { id = module.Id }, module);
    }

    // PUT: api/Modules/{id}
    [HttpPut("{id}")]
    public ActionResult Update(int id, Module module)
    {
        if (id != module.Id) return BadRequest();

        _repository.UpdateModule(module);
        return NoContent();
    }

    // DELETE: api/Modules/{id}
    [HttpDelete("{id}")]
    public ActionResult<Module> Delete(int id)
    {
        _repository.DeleteModule(id);
        return NoContent();
    }
}
