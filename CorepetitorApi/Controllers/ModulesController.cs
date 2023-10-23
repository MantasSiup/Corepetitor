using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;

[Route("api/tutors/{tutorId}/[controller]")]
[ApiController]
public class ModulesController : ControllerBase
{
    private readonly IModuleRepository _repository;

    public ModulesController(IModuleRepository repository)
    {
        _repository = repository;
    }

    // GET: api/tutors/{tutorId}/Modules
    [HttpGet]
    public ActionResult<IEnumerable<Module>> GetAll(int tutorId)
    {
        return Ok(_repository.GetAllModules(tutorId));
    }

    // GET: api/tutors/{tutorId}/Modules/{id}
    [HttpGet("{id}")]
    public ActionResult<Module> Get(int tutorId, int id)
    {
        var module = _repository.GetModuleById(tutorId, id);
        if (module == null) return NotFound();
        return Ok(module);
    }

    // POST: api/tutors/{tutorId}/Modules
    [HttpPost]
    public ActionResult<Module> Add(int tutorId, Module module)
    {
        _repository.AddModule(tutorId, module);
        return CreatedAtAction(nameof(Get), new { tutorId, id = module.Id }, module);
    }

    // PUT: api/tutors/{tutorId}/Modules/{id}
    [HttpPut("{id}")]
    public ActionResult Update(int tutorId, int id, Module module)
    {
        if (id != module.Id) return BadRequest();

        var updatedModule = _repository.UpdateModule(tutorId, module);
        if (updatedModule == null) return NotFound();

        return NoContent();
    }

    // DELETE: api/tutors/{tutorId}/Modules/{id}
    [HttpDelete("{id}")]
    public ActionResult<Module> Delete(int tutorId, int id)
    {
        if (!_repository.ModuleExists(id, tutorId)) return NotFound();

        _repository.DeleteModule(id);
        return NoContent();
    }
}
