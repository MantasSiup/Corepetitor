using CorepetitorApi.Data;
using CorepetitorApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CorepetitorApi.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly CorepetitorDbContext _context;

        public ChatRepository(CorepetitorDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChatMessage>> GetMessagesAsync(int moduleId, int studentId, int tutorId)
        {
            return await _context.ChatMessages
                .Where(m => m.ModuleId == moduleId &&
                            ((m.SenderId == studentId && m.SenderRole == "student") ||
                             (m.SenderId == tutorId && m.SenderRole == "tutor")))
                .OrderBy(m => m.Timestamp)
                .ToListAsync();
        }

        public async Task AddMessageAsync(ChatMessage message)
        {
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();
        }
    }

}
