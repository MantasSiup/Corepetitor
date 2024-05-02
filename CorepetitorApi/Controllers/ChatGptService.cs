using Microsoft.AspNetCore.Mvc;
using OpenAI_API;
using OpenAI_API.Models;

namespace CorepetitorApi.Controllers
{
    public class ChatGptService
    {
        private readonly OpenAIAPI _openAiClient;

        public ChatGptService(IConfiguration config)
        {
            string apiKey = config["AppSettings:OpenAiApiKey"];
            _openAiClient = new OpenAIAPI(apiKey);
        }

        public async Task<string> SendMessage(string userInput)
        {
            var chat = _openAiClient.Chat.CreateConversation();
            chat.Model = Model.DefaultChatModel;
            chat.AppendSystemMessage("A student will ask you for a suggestion what modules should he choose. you only have to answer what modules should the student choose, it can be multiple. Here is the list of modules you will need to select out of:");
            //chat.AppendSystemMessage("Math module (School level A), Lithuanian module (School level B), Math module (School level A), History module (University level), Program Systems module (University level), Networking module (Univesrity level), Programming module (School level A), Web-Design (School level B)");
            chat.AppendSystemMessage("Math module, Lithuanian module, Science module, History module, Program Systems module, Networking module, Programming module, Web-Design");
            chat.AppendUserInput(userInput);
            chat.AppendSystemMessage("Only reply the module names divided by \",\"");
            string response = await chat.GetResponseFromChatbotAsync();

            //Console.WriteLine(response);

            return response;
        }
    }
}


namespace CorepetitorApi.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly ChatGptService _chatGptService;

        public ChatController(ChatGptService chatGptService)
        {
            _chatGptService = chatGptService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> SendMessage([FromBody] JsonRequestModel model)
        {
            try
            {
                string response = await _chatGptService.SendMessage(model.UserInput);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        public class JsonRequestModel
        {
            public string UserInput { get; set; }
        }
    }
}
