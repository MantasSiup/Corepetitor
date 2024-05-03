using CorepetitorApi.Models;
using CorepetitorApi.Data;

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
    }
}
