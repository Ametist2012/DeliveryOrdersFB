using System.Reflection;
using Microsoft.EntityFrameworkCore;
using DeliveryOrders.Data;
using DeliveryOrders.Repositories;
using DeliveryOrders.Services;
using DeliveryOrders.Validators;
using DeliveryOrders.Middleware;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi("v1", options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        var assembly = typeof(Program).Assembly;

        document.Info.Title = assembly.GetName().Name?.ToString() ?? "DeliveryOrders.Api";
        document.Info.Version = assembly.GetName().Version?.ToString(3) ?? "1.0.0";
        document.Info.Description = assembly.GetCustomAttribute<AssemblyDescriptionAttribute>()?.Description ?? "null";

        return Task.CompletedTask;
    });
});


builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddScoped<IOrderValidator, OrderValidator>();  



var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/openapi/v1.json",
            "Delivery Orders API");
    });
}

app.UseHttpsRedirection();

//app.UseAuthentication(); //используется для аунтификации(проверки токена)
app.UseAuthorization();
app.MapControllers();



app.Run();

