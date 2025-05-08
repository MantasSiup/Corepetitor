using CorepetitorApi.Models;

namespace CorepetitorApi.Repositories
{
    public interface IChatRepository
    {
        Task<IEnumerable<ChatMessage>> GetMessagesAsync(int moduleId, int studentId, int tutorId);
        Task AddMessageAsync(ChatMessage message);
    }

}
