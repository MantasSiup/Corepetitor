using System.Collections.Generic;
using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface IModuleRepository
    {
        IEnumerable<Module> GetAllModules();
        Module GetModuleById(int id);
        void AddModule(Module module);
        void UpdateModule(Module module);
        void DeleteModule(int id);
    }
}
