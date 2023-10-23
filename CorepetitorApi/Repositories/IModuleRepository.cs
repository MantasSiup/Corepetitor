using System.Collections.Generic;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface IModuleRepository
    {
        IEnumerable<Module> GetAllModules(int tutorId);
        Module GetModuleById(int tutorId, int id);
        void AddModule(int tutorId, Module module);
        Module UpdateModule(int tutorId,Module module);
        void DeleteModule(int id);
        bool ModuleExists(int id, int tutorId);
    }
}
