using CorepetitorApi.Helper;
using CorepetitorApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using CorepetitorApi.Dtos;
using CorepetitorApi.Models;
using NuGet.Protocol.Core.Types;
using CorepetitorApi.Hubs;
using Microsoft.AspNetCore.SignalR;
using CorepetitorApi.Data;

namespace CorepetitorApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatRepository _chatRepository;
        private readonly CorepetitorDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatMessageController(IChatRepository chatRepository, IHubContext<ChatHub> hubContext, CorepetitorDbContext context)
        {
            _chatRepository = chatRepository;
            _hubContext = hubContext;
            _context = context;
        }

        [HttpGet("messages")]
        public IActionResult GetMessages([FromQuery] int moduleId, [FromQuery] int studentId, [FromQuery] int tutorId)
        {
            var messages = _context.ChatMessages
                .Where(m =>
                    m.ModuleId == moduleId &&
                    (
                        (m.SenderId == studentId && m.SenderRole == "student") ||
                        (m.SenderId == tutorId && m.SenderRole == "tutor")
                    ))
                .OrderBy(m => m.Timestamp)
                .ToList();

            return Ok(messages);
        }


        [HttpPost("send")]
        public async Task<IActionResult> Send(ChatMessage message)
        {
            message.Timestamp = DateTime.UtcNow;
            await _chatRepository.AddMessageAsync(message);

            // Determine expected student/tutor based on sender/recipient roles
            var isFromStudent = message.SenderRole == "student";

            var studentId = isFromStudent ? message.SenderId : message.RecipientId;
            var tutorId = isFromStudent ? message.RecipientId : message.SenderId;

            var studentModule = _context.StudentModules.FirstOrDefault(sm =>
                sm.ModuleId == message.ModuleId &&
                sm.StudentId == studentId &&
                sm.TutorId == tutorId);

            if (studentModule == null)
                return BadRequest("Student-module-tutor relation not found.");

            var studentGroup = $"module-{message.ModuleId}-student-{studentId}";
            var tutorGroup = $"module-{message.ModuleId}-tutor-{tutorId}";

            await _hubContext.Clients.Groups(studentGroup, tutorGroup)
                .SendAsync("ReceiveMessage",
                    message.SenderId,
                    message.SenderRole,
                    message.Message,
                    message.Timestamp);

            return Ok();
        }


    }

}
