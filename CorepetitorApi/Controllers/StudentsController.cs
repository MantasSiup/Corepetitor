using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using Microsoft.AspNetCore.Authorization;

[Route("api/tutors/{tutorId}/modules/{moduleId}/[controller]")]
[ApiController]
public class StudentsController : ControllerBase
{
    private readonly IStudentRepository _repository;

    public StudentsController(IStudentRepository repository)
    {
        _repository = repository;
    }

    // GET: api/tutors/{tutorId}/modules/{moduleId}/Students
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<IEnumerable<Student>> GetAll(int tutorId, int moduleId)
    {
        var students = _repository.GetAllStudents(tutorId, moduleId);

        if (!students.Any())
            return NotFound($"This tutor {tutorId} has no students in module {moduleId}.");

        return Ok(students);
    }

    // GET: api/tutors/{tutorId}/modules/{moduleId}/Students/{id}
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Student> Get(int tutorId, int moduleId, int id)
    {
        var student = _repository.GetStudentById(tutorId, moduleId, id);

        if (student == null)
            return NotFound($"Student with id {id} not found for tutor {tutorId} and module {moduleId}.");

        return Ok(student);
    }

    // POST: api/tutors/{tutorId}/modules/{moduleId}/Students
    [HttpPost]
    [Authorize (Roles = "admin, tutor")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<Student> Add(int tutorId, int moduleId, Student student)
    {
        _repository.AddStudent(tutorId, moduleId, student);
        return CreatedAtAction(nameof(Get), new { tutorId, moduleId, id = student.Id }, student);
    }

    // PUT: api/tutors/{tutorId}/modules/{moduleId}/Students/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "admin, tutor")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult Update(int tutorId, int moduleId, int id, Student student)
    {
        if (id != student.Id) return BadRequest("Student ID mismatch.");

        _repository.UpdateStudent(tutorId, moduleId, student);
        return NoContent();
    }
    
    // DELETE: api/tutors/{tutorId}/modules/{moduleId}/Students/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin, tutor")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<Student> Delete(int tutorId, int moduleId, int id)
    {
        _repository.DeleteStudent(tutorId, moduleId, id);
        return NoContent();
    }
}

