using System.Collections.Generic;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface ITutorRepository
    {
        IEnumerable<Tutor> GetAllTutors();
        Tutor GetTutorById(int id);
        void AddTutor(Tutor tutor);
        void UpdateTutor(Tutor tutor);
        void DeleteTutor(int id);
    }
}
