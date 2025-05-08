using System.Collections.Generic;
using CorepetitorApi.Dtos;
using CorepetitorApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CorepetitorApi.Repositories
{
    public interface IModuleRepository
    {
        IEnumerable<Module> GetAllModules(int tutorId);
        IEnumerable<Module> GetAllModules();
        IEnumerable<Module> GetModulesByStudentId(int id);
        Module GetModuleById(int tutorId, int id);
        void AddModule(int tutorId, Module module);
        bool AddTutorToModule(int tutorId, int moduleId);
        Module UpdateModule(int id, Module module);
        void DeleteModule(int id);
        void RemoveFromModule(int tutorId, int moduleId);
        bool ModuleExists(int id, int tutorId);
        IEnumerable<TutorPublicDto> GetTutorsByModule(int moduleId);
        IEnumerable<(Module Module, Tutor Tutor)> GetStudentModulesWithTutors(int studentId);
        bool UpdateTutorModuleRating(int tutorId, int moduleId, double rating);

    }
}
