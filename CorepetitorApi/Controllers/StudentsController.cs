using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Repositories;
using CorepetitorApi.Models;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class StudentsController : ControllerBase
{
    private readonly IStudentRepository _repository;

    public StudentsController(IStudentRepository repository)
    {
        _repository = repository;
    }

    // GET: api/Students
    [HttpGet]
    public ActionResult<IEnumerable<Student>> GetAll() => Ok(_repository.GetAllStudents());

    // GET: api/Students/{id}
    [HttpGet("{id}")]
    public ActionResult<Student> Get(int id)
    {
        var student = _repository.GetStudentById(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    // POST: api/Students
    [HttpPost]
    public ActionResult<Student> Add(Student student)
    {
        _repository.AddStudent(student);
        return CreatedAtAction(nameof(Get), new { id = student.Id }, student);
    }

    // PUT: api/Students/{id}
    [HttpPut("{id}")]
    public ActionResult Update(int id, Student student)
    {
        if (id != student.Id) return BadRequest();

        _repository.UpdateStudent(student);
        return NoContent();
    }

    // DELETE: api/Students/{id}
    [HttpDelete("{id}")]
    public ActionResult<Student> Delete(int id)
    {
        _repository.DeleteStudent(id);
        return NoContent();
    }
}
