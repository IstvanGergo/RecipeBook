using Microsoft.EntityFrameworkCore;
using OpenAI.Chat;
using RecipeBook.Data;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<ChatClient>( serviceProvider =>
    {
        String? apiKey = builder.Configuration["OpenAIApiKey"];
        return new ChatClient( "gpt-5-nano", apiKey ); 
    });

builder.Services.AddControllersWithViews();
builder.Services.AddCors( options =>
{
    options.AddPolicy( "AllowReactApp",
        policy =>
        {
            policy.WithOrigins( "http://localhost:3000" )
            .AllowAnyHeader()
            .AllowAnyMethod();
        } );
} );

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

app.UseCors( "AllowReactApp" );
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Recipes}/{action=Index}/{id?}" );

app.Run();
