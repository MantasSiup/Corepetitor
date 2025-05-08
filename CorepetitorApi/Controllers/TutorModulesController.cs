using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Models;
using CorepetitorApi.Repositories;
using CorepetitorApi.Dtos;

namespace CorepetitorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TutorModulesController : ControllerBase
    {
        private readonly IModuleRepository _repository;
        private readonly RatingService _ratingService;
        public TutorModulesController(IModuleRepository repository, RatingService ratingService)
        {
            _repository = repository;
            _ratingService = ratingService;
        }

        // GET: api/TutorModules/module/{moduleId}/tutors
        [HttpGet("module/{moduleId}/tutors")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public ActionResult<IEnumerable<TutorPublicDto>> GetTutorsByModule(int moduleId)
        {
            var tutors = _repository.GetTutorsByModule(moduleId);

            if (!tutors.Any())
                return NotFound($"No tutors found for module ID {moduleId}");

            return Ok(tutors);
        }

        // POST: api/TutorModules/rate
        [HttpPost("rate")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult RateTutorModule([FromBody] TutorModuleRatingDto dto)
        {
            if (dto.Rating < 1.0 || dto.Rating > 5.0)
                return BadRequest("Rating must be between 1.0 and 5.0");

            var success = _repository.UpdateTutorModuleRating(dto.TutorId, dto.ModuleId, dto.Rating);

            if (!success)
                return BadRequest("Rating update failed.");

            _ratingService.UpdateTutorAverageRating(dto.TutorId);

            return Ok("Rating submitted successfully.");
        }

        [HttpGet("{moduleId}/rating")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetModuleRating(int moduleId, [FromQuery] int tutorId)
        {
            var rating = _ratingService.GetModuleRating(moduleId, tutorId);

            if (rating == null)
                return NotFound("No rating found for this module and tutor.");

            return Ok(rating);
        }

        [HttpGet("{moduleId}/ratings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetModuleRating(int moduleId, [FromQuery] int tutorId, [FromQuery] int studentId)
        {
            var rating = _ratingService.GetStudentModuleRatings(moduleId, tutorId, studentId);

            if (rating == null)
                return NotFound("No rating found for this module and tutor.");

            return Ok(rating);
        }


        [HttpPost("submit-rating")]
        public IActionResult SubmitStudentRating([FromBody] TutorModuleRatingDto dto)
        {
            if (dto.Rating < 1.0 || dto.Rating > 5.0)
                return BadRequest("Rating must be between 1.0 and 5.0");

            _ratingService.SubmitOrUpdateStudentRating(dto.TutorId, dto.ModuleId, dto.StudentId, (decimal)dto.Rating);

            return Ok("Rating submitted.");
        }


    }
}
