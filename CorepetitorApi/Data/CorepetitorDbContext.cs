using Microsoft.EntityFrameworkCore;
using CorepetitorApi.Models;

namespace CorepetitorApi.Data
{
    public class CorepetitorDbContext : DbContext
    {
        public CorepetitorDbContext(DbContextOptions<CorepetitorDbContext> options)
            : base(options)
        { }

        public DbSet<Tutor> Tutors { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<StudentModule> StudentModules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tutor>()
               .HasMany(t => t.Modules)
               .WithOne(m => m.Tutor)
               .HasForeignKey(m => m.TutorId);

            modelBuilder.Entity<Student>()
                .HasMany(s => s.StudentModules)
                .WithOne(sm => sm.Student)
                .HasForeignKey(sm => sm.StudentId);

            modelBuilder.Entity<Module>()
                .HasMany(m => m.StudentModules)
                .WithOne(sm => sm.Module)
                .HasForeignKey(sm => sm.ModuleId);
        }

    }

}
