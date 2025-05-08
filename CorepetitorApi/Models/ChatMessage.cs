namespace CorepetitorApi.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public int ModuleId { get; set; }

        public int SenderId { get; set; }
        public string SenderRole { get; set; } = ""; 

        public string Message { get; set; } = "";

        public int RecipientId { get; set; }
        public string RecipientRole { get; set; } = "";

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
