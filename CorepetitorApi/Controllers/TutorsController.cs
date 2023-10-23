using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class TutorsController : ControllerBase
{
    private readonly ITutorRepository _repository;

    public TutorsController(ITutorRepository repository)
    {
        _repository = repository;
    }

    // GET: api/Tutors
    [HttpGet]
    public ActionResult<IEnumerable<Tutor>> GetAll()
    {
        var tutors = _repository.GetAllTutors();

        if (!tutors.Any())
            return NotFound("No tutors found.");

        return Ok(tutors);
    }

    // GET: api/Tutors/{id}
    [HttpGet("{id}")]
    public ActionResult<Tutor> Get(int id)
    {
        var tutor = _repository.GetTutorById(id);

        if (tutor == null)
            return NotFound($"Tutor with id {id} not found.");

        return Ok(tutor);
    }

    // POST: api/Tutors
    [HttpPost]
    public ActionResult<Tutor> Add(Tutor tutor)
    {
        // You might want to check if the tutor already exists to prevent duplicates.
        _repository.AddTutor(tutor);
        return CreatedAtAction(nameof(Get), new { id = tutor.Id }, tutor);
    }

    // PUT: api/Tutors/{id}
    [HttpPut("{id}")]
    public ActionResult Update(int id, Tutor tutor)
    {
        if (id != tutor.Id)
            return BadRequest("Tutor ID mismatch.");

        // You can check if the update was successful, similar to the ModulesController.
        _repository.UpdateTutor(tutor);
        return NoContent();
    }

    // DELETE: api/Tutors/{id}
    [HttpDelete("{id}")]
    public ActionResult<Tutor> Delete(int id)
    {
        // Before deleting, it might be wise to check if the tutor exists.
        var tutor = _repository.GetTutorById(id);
        if (tutor == null)
            return NotFound($"Tutor with id {id} not found.");

        _repository.DeleteTutor(id);
        return NoContent();
    }
}
