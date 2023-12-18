using CorepetitorApi.Models;
using CorepetitorApi.Data;
using CorepetitorApi.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;

namespace CorepetitorApi.Repositories
{
    public class TutorRepository : ITutorRepository
    {
        private readonly CorepetitorDbContext _context;

        public TutorRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public IEnumerable<TutorDto> GetAllTutors() 
        {
            return _context.Tutors.Select(t => new TutorDto
            {
                Id = t.Id,
                Name = t.Name,
                Email = t.Email,
                Password = t.Password,
                PhoneNumber = t.PhoneNumber,
                Address = t.Address,
                City = t.City
            }).ToList();
        }

        public TutorDto GetTutorById(int id)
        {
            return _context.Tutors.Where(t => t.Id == id)
                .Select(t => new TutorDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Email = t.Email,
                    Password = t.Password,
                    PhoneNumber = t.PhoneNumber,
                    Address = t.Address,
                    City = t.City
                }).FirstOrDefault();
        }

        public void AddTutor(Tutor tutor)
        {
            _context.Tutors.Add(tutor);
            _context.SaveChanges();
        }

        public void UpdateTutor(Tutor tutor)
        {
            _context.Tutors.Update(tutor);
            _context.SaveChanges();
        }

        public void DeleteTutor(int id)
        {
            var tutor = _context.Tutors.Find(id);
            if (tutor != null)
            {
                _context.Tutors.Remove(tutor);
                _context.SaveChanges();
            }
        }
    }

/*public static class TutorEndpoints
{
	public static void MapTutorEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Tutor").WithTags(nameof(Tutor));

        group.MapGet("/", async (CorepetitorDbContext db) =>
        {
            return await db.Tutors.ToListAsync();
        })
        .WithName("GetAllTutors")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Tutor>, NotFound>> (int id, CorepetitorDbContext db) =>
        {
            return await db.Tutors.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id)
                is Tutor model
                    ? TypedResults.Ok(model)
                    : TypedResults.NotFound();
        })
        .WithName("GetTutorById")
        .WithOpenApi();

        group.MapPut("/{id}", async Task<Results<Ok, NotFound>> (int id, Tutor tutor, CorepetitorDbContext db) =>
        {
            var affected = await db.Tutors
                .Where(model => model.Id == id)
                .ExecuteUpdateAsync(setters => setters
                  .SetProperty(m => m.Id, tutor.Id)
                  .SetProperty(m => m.Name, tutor.Name)
                  .SetProperty(m => m.Email, tutor.Email)
                  .SetProperty(m => m.Password, tutor.Password)
                  .SetProperty(m => m.PhoneNumber, tutor.PhoneNumber)
                  .SetProperty(m => m.Address, tutor.Address)
                  .SetProperty(m => m.City, tutor.City)
                  );
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("UpdateTutor")
        .WithOpenApi();

        group.MapPost("/", async (Tutor tutor, CorepetitorDbContext db) =>
        {
            db.Tutors.Add(tutor);
            await db.SaveChangesAsync();
            return TypedResults.Created($"/api/Tutor/{tutor.Id}",tutor);
        })
        .WithName("CreateTutor")
        .WithOpenApi();

        group.MapDelete("/{id}", async Task<Results<Ok, NotFound>> (int id, CorepetitorDbContext db) =>
        {
            var affected = await db.Tutors
                .Where(model => model.Id == id)
                .ExecuteDeleteAsync();
            return affected == 1 ? TypedResults.Ok() : TypedResults.NotFound();
        })
        .WithName("DeleteTutor")
        .WithOpenApi();
    }
}*/
}
