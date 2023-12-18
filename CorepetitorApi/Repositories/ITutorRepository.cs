using System.Collections.Generic;
using CorepetitorApi.Dtos;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface ITutorRepository
    {
        IEnumerable<TutorDto> GetAllTutors();
        TutorDto GetTutorById(int id);
        void AddTutor(Tutor tutor);
        void UpdateTutor(Tutor tutor);
        void DeleteTutor(int id);
    }
}
