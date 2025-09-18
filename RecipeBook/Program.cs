using Microsoft.EntityFrameworkCore;
using OpenAI;
using OpenAI.Chat;
using RecipeBook.Data;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ChatClient>( serviceProvider =>
    {
        var key = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        return new ChatClient( "gpt-4o", key ); });

// Add services to the container.
builder.Services.AddControllersWithViews();

ConfigurationManager configuration = builder.Configuration;
builder.Services.AddDbContext<RecipeDbContext>( options => options.UseNpgsql(
    configuration["ConnectionStrings:RecipeBookConnection"] ) );
var app = builder.Build();

// Configure the HTTP request pipeline.
if ( !app.Environment.IsDevelopment() )
{
    app.UseExceptionHandler( "/Home/Error" );
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}" );

app.Run();
