using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using PrimordialDuckOperation.Application.DTOs;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PrimordialDuckOperation.CrossCutting.Swagger;

public class ApiErrorResponseSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (context.Type == typeof(ApiErrorResponse))
        {
            schema.Example = new OpenApiObject
            {
                ["success"] = new OpenApiBoolean(false),
                ["message"] = new OpenApiString("string"),
                ["errors"] = new OpenApiArray
                {
                    new OpenApiString("string")
                }
            };
        }
    }
}