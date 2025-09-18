using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Newtonsoft.Json.Schema;
using OpenAI;
using OpenAI.Chat;
namespace RecipeBook.Controllers
{
    public static class ChatCompletions
    {
        public static ChatCompletionOptions recipeReturn = new()
        {
            ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                "recipe",
                BinaryData.FromBytes("""
                    {
                        "type":"object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "time": {
                                "type": "number"
                            },
                            "short_description": {
                                "type": "string"
                            },
                            "tags":{
                                "type": "array",
                                "items":{
                                    "type": "string"
                                }
                            },
                            "steps": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "number": { "type": "number" },
                                        "description": { "type": "string" }
                                    }
                                }
                            },
                            "quantities":{
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "ingredient": { "type": "string" },
                                        "quantity": { "type": "number" },
                                        "measurement": { "type": "string"}
                                    }
                                }
                            }
                        }
                    }
                    """u8.ToArray()),
                "You are an AI assistant that parses a picture of a recipe into JSON. If there are any all uppercase strings, rewrite them to only start with uppercase.",
                true)
        };
    }
}
