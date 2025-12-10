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
                            "name": { "type": "string" },
                            "time": { "type": "number" },
                            "short_description": { "type": "string" },
                            "tags":{
                                "type": "array",
                                "items":{ "type": "string" }
                            },
                            "steps": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "number": { "type": "number" },
                                        "description": { "type": "string" }
                                    },
                                    "required": ["number", "description"],
                                    "additionalProperties": false
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
                                    },
                                "required": ["ingredient", "quantity", "measurement"],
                                "additionalProperties": false
                                }
                            }
                        },
                        "required": ["name", "time", "short_description", "tags", "steps", "quantities"],
                        "additionalProperties": false
                    }
                    """u8.ToArray()),
                "Egy AI asszisztens vagy, aki receptek képeit konvertálja JSON formátumba. Eközben írj át minden betűt kisbetűre. Amennyiben a kép nem tartalmaz receptet, üres JSON-el válaszolj.",
                true)
        };
    }
}
