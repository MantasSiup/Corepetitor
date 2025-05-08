using CorepetitorApi.Models;
using CorepetitorApi.Data;
using CorepetitorApi.Dtos;

namespace CorepetitorApi.Repositories
{
    public class ModuleRepository : IModuleRepository
    {
        private readonly CorepetitorDbContext _context;

        public ModuleRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Module> GetAllModules(int tutorId) 
        { 

            var moduleIds = _context.TutorModules.Where(t => t.TutorId == tutorId).Select(m => m.ModuleId).ToList();

            return _context.Modules
                  .Where(m => moduleIds.Contains(m.Id))
                  .ToList();
        } 

        public IEnumerable<Module> GetAllModules() => _context.Modules.ToList().DistinctBy(x => x.Name);

        public Module GetModuleById(int tutorId, int id)
        {
            var tutorModule = _context.TutorModules.FirstOrDefault(tm => tm.TutorId == tutorId && tm.ModuleId == id);

            if (tutorModule == null)
            {
                return null;
            }

            return _context.Modules.FirstOrDefault(m => m.Id == id);
        }

        public IEnumerable<Module> GetModulesByStudentId(int id)
        {
            var studentModules = _context.StudentModules
         .Where(st => st.StudentId == id)
         .Select(st => st.ModuleId)
         .ToList(); 

            var result = _context.Modules
                .Where(module => studentModules.Contains(module.Id))
                .ToList(); 

            return result;
        }

        public void AddModule(int TutorId, Module module)
        {
            //module.TutorId = TutorId;
            _context.Modules.Add(module);
            _context.SaveChanges();

            _context.TutorModules.Add(new TutorModule { TutorId = TutorId, ModuleId = module.Id });

           // var tutor = _context.Tutors.Find(TutorId);
            //tutor.Modules.Add(module);
            _context.SaveChanges();

        }

        public bool AddTutorToModule(int TutorId, int moduleId)
        {
            if (_context.TutorModules.Any(m => m.TutorId == TutorId && m.ModuleId == moduleId)) 
            {
                return false;
            }
            _context.TutorModules.Add(new TutorModule { TutorId = TutorId, ModuleId = moduleId });
            _context.SaveChanges();
            return true;

        }

        public Module? UpdateModule(int id, Module module)
        {
            //module.TutorId = tutorId;
            if (!_context.Modules.Any(m => m.Id == id))
            {
                return null;
            }
            var existingModule = _context.Modules.Find(id);
            try
            {
                if (module.Name != null)
                {
                    existingModule.Name = module.Name;
                }
                if (module.Description != null)
                {
                    existingModule.Description = module.Description;
                }
                if (module.PricePerHour != null)
                {
                    existingModule.PricePerHour = module.PricePerHour;
                }
                if (module.StartDate != null)
                {
                    existingModule.StartDate = module.StartDate;
                }
                if (module.EndDate != null)
                {
                    existingModule.EndDate = module.EndDate;
                }

                _context.Modules.Update(existingModule);
                _context.SaveChanges();
            }
            catch
            {
                return null;
            }

            return existingModule;
        }

        public void DeleteModule(int id)
        {
            var module = _context.Modules.Find(id);
            if (module != null)
            {
                _context.Modules.Remove(module);
                var deletableModules = _context.TutorModules.Where(m => m.ModuleId == module.Id).ToList();
                foreach (var mod in deletableModules)
                {
                    _context.Remove(mod);
                }
                _context.SaveChanges();
            }
        }
        public void RemoveFromModule(int tutorId, int moduleId)
        {
            var mod = _context.TutorModules.FirstOrDefault(m => m.TutorId == tutorId && m.ModuleId == moduleId); 
           _context.Remove(mod);      
           _context.SaveChanges();
        }

        public bool ModuleExists(int id, int tutorId)
        {
            return _context.TutorModules.Any(tm => tm.ModuleId == id && tm.TutorId == tutorId);
        }

        public IEnumerable<TutorPublicDto> GetTutorsByModule(int moduleId)
        {
            return _context.TutorModules
                .Where(tm => tm.ModuleId == moduleId)
                .Join(
                    _context.Tutors,
                    tm => tm.TutorId,
                    t => t.Id,
                    (tm, t) => new TutorPublicDto
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Email = t.Email,
                        PhoneNumber = t.PhoneNumber,
                        Address = t.Address,
                        City = t.City,
                        AverageRating = t.AverageRating
                    }
                )
                .ToList();
        }

        public IEnumerable<(Module, Tutor)> GetStudentModulesWithTutors(int studentId)
        {
            var studentModules = _context.StudentModules
                .Where(sm => sm.StudentId == studentId)
                .ToList();

            var result = studentModules
                .Select(sm =>
                {
                    var module = _context.Modules.FirstOrDefault(m => m.Id == sm.ModuleId);
                    var tutorModule = _context.TutorModules.FirstOrDefault(tm => tm.ModuleId == sm.ModuleId && tm.TutorId == sm.TutorId);
                    var tutor = tutorModule != null
                        ? _context.Tutors.FirstOrDefault(t => t.Id == tutorModule.TutorId)
                        : null;

                    return (module, tutor);
                });

            return result!;
        }

        public bool UpdateTutorModuleRating(int tutorId, int moduleId, double rating)
        {
            if (rating < 1.0 || rating > 5.0)
                throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1.0 and 5.0");

            var record = _context.TutorModules.FirstOrDefault(tm => tm.TutorId == tutorId && tm.ModuleId == moduleId);
            if (record == null) return false;

            record.Rating = Convert.ToDecimal(rating);

            var allRatings = _context.TutorModules
                .Where(tm => tm.TutorId == tutorId && tm.Rating > 0)
                .Select(tm => tm.Rating)
                .ToList();

            if (allRatings.Count > 0)
            {
                var average = allRatings.Average();
                var tutor = _context.Tutors.FirstOrDefault(t => t.Id == tutorId);
                if (tutor != null)
                {
                    tutor.AverageRating = average;
                }
            }

            _context.SaveChanges();
            return true;
        }
    }
}
