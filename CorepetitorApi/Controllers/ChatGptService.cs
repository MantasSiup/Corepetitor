using System;
using CorepetitorApi.Models;
using CorepetitorApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using NuGet.Protocol;
using OpenAI_API;
using OpenAI_API.Models;

namespace CorepetitorApi.Controllers
{
    public class ChatGptService
    {
        private readonly OpenAIAPI _openAiClient;
        private readonly IModuleRepository _moduleRepository;
        private readonly UniqueModulesController _uniqueModulesController;

        public ChatGptService(IConfiguration config, IModuleRepository moduleRepository)
        {
            string apiKey = config["AppSettings:OpenAiApiKey"];
            _openAiClient = new OpenAIAPI(apiKey);
            _moduleRepository = moduleRepository;
            _uniqueModulesController = new UniqueModulesController(_moduleRepository);
        }

        public async Task<string> SendMessage(string userInput)
        {
            var chat = _openAiClient.Chat.CreateConversation();
            chat.Model = Model.GPT4_Turbo;

            var result = _uniqueModulesController.GetAllUniqueModules();

            if (result.Result is OkObjectResult okResult)
            {
                var modules = okResult.Value as IEnumerable<Module>;
                if (modules != null)
                {
                    var descriptions = string.Join(";", modules.Select(m => m.Description));
                    chat.AppendSystemMessage($"""
                    You are a helpful assistant that suggests suitable learning modules to students based on their goals, interests, or exam preparation. You must only respond with the names of relevant modules from the provided list — separated by semicolons (;).

                    Guidelines:
                    - ONLY suggest modules from the list below.
                    - If the student mentions a level (e.g., A, B), prefer modules that match or are appropriate for that level.
                    - If exam preparation is mentioned, prioritize ADVANCED modules.
                    - If no relevant modules match, respond with an empty string.
                    - DO NOT suggest unrelated or general modules.
                    - NEVER explain or add extra text — just return the selected module names.

                    Module list:
                    {descriptions}

                    """);

                    chat.AppendUserInput(userInput);
                    chat.AppendSystemMessage("Respond ONLY with the selected module names, separated by semicolons (;), and nothing else.");

                    string response = await chat.GetResponseFromChatbotAsync();

                    //Console.WriteLine(response);

                    return response;
                }
            }
         
            return string.Empty;
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
