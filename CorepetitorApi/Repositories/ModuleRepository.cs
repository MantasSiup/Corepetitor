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

        public IEnumerable<Module> GetAllModules(int tutorId) => _context.Modules.Where(m=>m.TutorId==tutorId).ToList();

        public Module GetModuleById(int tutorId, int id)
        {
            return _context.Modules.Where(m => m.TutorId == tutorId).FirstOrDefault();
        }

        public void AddModule(int TutorId, Module module)
        {
            module.TutorId = TutorId;
            _context.Modules.Add(module);
            _context.SaveChanges();

            var tutor = _context.Tutors.Find(TutorId);
            tutor.Modules.Add(module);
            _context.SaveChanges();

        }

        public Module? UpdateModule(int tutorId, Module module)
        {
            module.TutorId = tutorId;
            if (!ModuleExists(module.Id, tutorId))
            {
                return null;
            }
            var existingModule = _context.Modules.Find(module.Id);
            try
            {
                _context.Modules.Update(module);
                _context.SaveChanges();
            }
            catch
            {
                return null;
            }

            return module;
        }

        public void DeleteModule(int id)
        {
            var module = _context.Modules.Find(id);
            if (module != null)
            {
                _context.Modules.Remove(module);
                _context.SaveChanges();
            }
        }


        public bool ModuleExists(int id, int tutorId)
        {
            return (_context.Modules?.Any(e => e.Id == id && e.TutorId == tutorId)).GetValueOrDefault();
        }
    }
}
