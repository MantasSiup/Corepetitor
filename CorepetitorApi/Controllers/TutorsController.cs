using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;
using CorepetitorApi.Dtos;

//[Authorize (Roles = "admin")]
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
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<IEnumerable<Tutor>> GetAll()
    {
        var tutors = _repository.GetAllTutors();

        if (!tutors.Any())
            return NotFound("No tutors found.");

        return Ok(tutors);
    }

    // GET: api/Tutors/{id}
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<Tutor> Get(int id)
    {
        var tutor = _repository.GetTutorById(id);

        if (tutor == null)
            return NotFound($"Tutor with id {id} not found.");

        return Ok(tutor);
    }

    [HttpGet("get-by-email")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<Tutor> GetTutorByEmail([FromQuery] string email)
    {
        var tutor = _repository.GetTutorByEmail(email);

        if (tutor == null)
            return NotFound($"Tutor with email: {email} not found.");

        return Ok(tutor);
    }

    // POST: api/Tutors
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult<Tutor> Add(Tutor tutor)
    {
        if (string.IsNullOrWhiteSpace(tutor.Email) || string.IsNullOrWhiteSpace(tutor.Password))
            return BadRequest("Email and password are required.");
        _repository.AddTutor(tutor);
        return CreatedAtAction(nameof(Get), new { id = tutor.Id }, tutor);
    }

    // PUT: api/Tutors/{id}
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public ActionResult Update(int id, TutorDto dto)
    {
        if (id != dto.Id)
            return BadRequest("Tutor ID mismatch.");

        var existingTutor = _repository.GetTutorById(id);
        if (existingTutor == null)
            return NotFound($"Tutor with ID {id} not found.");
        var updatedTutor = new Tutor
        {
            Id = dto.Id,
            Name = dto.Name,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Address = dto.Address,
            City = dto.City,
            Password = existingTutor.Password // preserve original password
        };

        _repository.UpdateTutor(updatedTutor);
        return NoContent();
    }

    // DELETE: api/Tutors/{id}
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
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
