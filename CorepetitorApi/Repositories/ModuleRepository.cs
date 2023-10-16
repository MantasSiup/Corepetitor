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

        public IEnumerable<Module> GetAllModules() => _context.Modules.ToList();

        public Module GetModuleById(int id) => _context.Modules.Find(id);

        public void AddModule(Module module)
        {
            _context.Modules.Add(module);
            _context.SaveChanges();
        }

        public void UpdateModule(Module module)
        {
            _context.Modules.Update(module);
            _context.SaveChanges();
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
    }
}
