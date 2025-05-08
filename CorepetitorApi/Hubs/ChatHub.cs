namespace CorepetitorApi.Hubs
{
    using Microsoft.AspNetCore.SignalR;

    public class ChatHub : Hub
    {
        public async Task SendMessage(string moduleId, string senderId, string role, string message)
        {
            var timestamp = DateTime.UtcNow;

            await Clients.Group(moduleId).SendAsync("ReceiveMessage", senderId, role, message, timestamp);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var moduleId = httpContext.Request.Query["moduleId"];
            var senderId = httpContext.Request.Query["senderId"];
            var senderRole = httpContext.Request.Query["senderRole"];

            if (!string.IsNullOrEmpty(moduleId) && !string.IsNullOrEmpty(senderId) && !string.IsNullOrEmpty(senderRole))
            {
                var groupName = $"module-{moduleId}-{senderRole}-{senderId}";
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }

            await base.OnConnectedAsync();
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            var moduleId = httpContext.Request.Query["moduleId"];

            if (!string.IsNullOrEmpty(moduleId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, moduleId);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }

}
