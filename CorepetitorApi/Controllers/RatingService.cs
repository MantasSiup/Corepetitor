namespace CorepetitorApi.Controllers
{
    using CorepetitorApi.Data;
    using CorepetitorApi.Models;
    using Microsoft.EntityFrameworkCore;

    public class RatingService
    {
        private readonly CorepetitorDbContext _context;

        public RatingService(CorepetitorDbContext context)
        {
            _context = context;
        }

        public decimal? GetModuleRating(int moduleId, int tutorId)
        {
            var tutorModule = _context.TutorModules
                .FirstOrDefault(tm => tm.ModuleId == moduleId && tm.TutorId == tutorId);

            return tutorModule?.Rating;
        }

        public decimal? GetStudentModuleRatings(int moduleId, int tutorId, int studentId)
        {
            var tutorModuleRatings = _context.TutorModuleRatings
                .FirstOrDefault(tm => tm.ModuleId == moduleId && tm.TutorId == tutorId && tm.StudentId == studentId);

            return tutorModuleRatings?.Rating;
        }

        public void UpdateTutorAverageRating(int tutorId)
        {
            var ratings = _context.TutorModules
                .Where(tm => tm.TutorId == tutorId && tm.Rating.HasValue)
                .Select(tm => tm.Rating.Value)
                .ToList();

            var tutor = _context.Tutors.Find(tutorId);

            if (tutor == null)
                return;

            if (!ratings.Any())
            {
                tutor.AverageRating = null;
            }
            else
            {
                tutor.AverageRating = Math.Round(ratings.Average(), 2);
            }

            _context.SaveChanges();
        }

        public void SubmitOrUpdateStudentRating(int tutorId, int moduleId, int studentId, decimal rating)
        {
            var existing = _context.TutorModuleRatings
                .FirstOrDefault(r => r.TutorId == tutorId && r.ModuleId == moduleId && r.StudentId == studentId);

            if (existing != null)
            {
                existing.Rating = rating;
                existing.Timestamp = DateTime.UtcNow;
            }
            else
            {
                _context.TutorModuleRatings.Add(new TutorModuleRating
                {
                    TutorId = tutorId,
                    ModuleId = moduleId,
                    StudentId = studentId,
                    Rating = rating
                });
            }

            _context.SaveChanges();

            UpdateTutorModuleAverage(tutorId, moduleId);
            UpdateTutorAverageRating(tutorId);
        }

        public void UpdateTutorModuleAverage(int tutorId, int moduleId)
        {
            var ratings = _context.TutorModuleRatings
                .Where(r => r.TutorId == tutorId && r.ModuleId == moduleId)
                .Select(r => r.Rating)
                .ToList();

            if (ratings.Count == 0) return;

            var average = ratings.Average();
            var tutorModule = _context.TutorModules
                .FirstOrDefault(tm => tm.TutorId == tutorId && tm.ModuleId == moduleId);

            if (tutorModule != null)
            {
                tutorModule.Rating = Math.Round(average, 2);
                _context.SaveChanges();
            }
        }

    }

}
