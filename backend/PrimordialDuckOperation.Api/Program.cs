using PrimordialDuckOperation.Api.Middleware;
using PrimordialDuckOperation.CrossCutting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureDependencyInjection(builder.Configuration);

var app = builder.Build();

await app.ConfigurePrimordialDuckApp();

app.UseMiddleware<ExceptionHandlerMiddleware>();

app.UseSwagger();
app.UseSwaggerUI(x =>
{
    x.SwaggerEndpoint("/swagger/v1/swagger.json", "PrimordialDuckOperation - v1");
    x.InjectStylesheet("/swagger-ui/SwaggerDark.css");
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseStaticFiles();

app.UseCors("AllowReactApp");

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
