using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface ILessonScheduleRepository
    {
        IEnumerable<LessonSchedule> GetLessonsForUser(int userId, string role);
        void AddLesson(LessonSchedule lesson);
    }
}
