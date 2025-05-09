using CorepetitorApi.Dtos;
using CorepetitorApi.Models;
using CorepetitorApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CorepetitorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonScheduleController : ControllerBase
    {
        private readonly ILessonScheduleRepository _repository;

        public LessonScheduleController(ILessonScheduleRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("user")]
        public ActionResult<IEnumerable<LessonScheduleDto>> GetLessonsForUser(int userId, string role)
        {
            var lessons = _repository.GetLessonsForUser(userId, role)
                .Select(lesson => new LessonScheduleDto
                {
                    TutorId = lesson.TutorId,
                    StudentId = lesson.StudentId,
                    ModuleId = lesson.ModuleId,
                    StartTime = lesson.StartTime,
                    EndTime = lesson.EndTime,
                    Description = lesson.Description
                });

            return Ok(lessons);
        }

        [HttpPost]
        public IActionResult AddLesson([FromBody] LessonScheduleDto dto)
        {
            var lesson = new LessonSchedule
            {
                TutorId = dto.TutorId,
                StudentId = dto.StudentId,
                ModuleId = dto.ModuleId,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Description = dto.Description
            };

            _repository.AddLesson(lesson);
            return Ok("Lesson scheduled successfully.");
        }
    }


}
