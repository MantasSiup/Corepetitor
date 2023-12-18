using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

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
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<IEnumerable<Module>> GetAll(int tutorId)
    {
        return Ok(_repository.GetAllModules(tutorId));
    }

    // GET: api/tutors/{tutorId}/Modules/{id}
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public ActionResult<Module> Get(int tutorId, int id)
    {
        var module = _repository.GetModuleById(tutorId, id);
        if (module == null) return NotFound();
        return Ok(module);
    }

    // POST: api/tutors/{tutorId}/Modules
    [HttpPost]
    [Authorize(Roles = "admin, tutor")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Module> Add(int tutorId, Module module)
    {
        _repository.AddModule(tutorId, module);
        return CreatedAtAction(nameof(Get), new { tutorId, id = module.Id }, module);
    }

    // PUT: api/tutors/{tutorId}/Modules/{id}
    [Authorize(Roles = "admin, tutor")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]

    public ActionResult Update(int tutorId, int id, Module module)
    {
        if (id != module.Id) return BadRequest();

        var updatedModule = _repository.UpdateModule(tutorId, module);
        if (updatedModule == null) return NotFound();

        return NoContent();
    }

    // DELETE: api/tutors/{tutorId}/Modules/{id}
    [Authorize(Roles = "admin, tutor")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]

    public ActionResult<Module> Delete(int tutorId, int id)
    {
        if (!_repository.ModuleExists(id, tutorId)) return NotFound();

        _repository.DeleteModule(id);
        return NoContent();
    }
}
