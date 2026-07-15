using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Any;
using DeliveryOrders.Data;
using DeliveryOrders.Repositories;
using DeliveryOrders.Services;
using DeliveryOrders.Validators.Interfaces;
using DeliveryOrders.Middleware;
using DeliveryOrders.Validators;
using System.Text.Json.Serialization;

using DeliveryOrders.Repositories.Interfaces;
using DeliveryOrders.Services.Interfaces;

using DeliveryOrders.Models;
using DeliveryOrders.Models.Enums;
using DeliveryOrders.DTOs.Auth;


//JWT Auth
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IOrderValidator, OrderValidator>();  
builder.Services.AddScoped<IAdminRegisterValidator, AdminRegisterValidator>();
builder.Services.AddScoped<IUserRegisterValidator, UserRegisterValidator>();
builder.Services.AddScoped<IUserLoginValidator, UserLoginValidator>();
builder.Services.AddScoped<IOrderQueryValidator, OrderQueryValidator>();


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

        // JWT Bearer Авторизация для Swagger
        document.Components ??= new OpenApiComponents();

        if (!document.Components.SecuritySchemes.ContainsKey("Bearer"))
         {
            document.Components.SecuritySchemes.Add( "Bearer", 
                                    new OpenApiSecurityScheme
                                    {   Type = SecuritySchemeType.Http,
                                        Scheme = "bearer",
                                        BearerFormat = "JWT",
                                        Description = "Введите JWT токен в формате: Bearer {token}" });
        }
            document.SecurityRequirements.Add( new OpenApiSecurityRequirement
            { { new OpenApiSecurityScheme
                 { Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        } }, Array.Empty<string>()
              } }                           );

        return Task.CompletedTask;
    });

        //Swagger обработчик
    options.AddSchemaTransformer((schema, context, cancellationToken) =>
    {
        if (context.JsonTypeInfo.Type == typeof(RegisterRequest) ||
            context.JsonTypeInfo.Type == typeof(AdminRegisterRequest) ||
            context.JsonTypeInfo.Type == typeof(LoginRequest))
            {
                if (schema.Properties.TryGetValue("email", out var emailProperty))
                     { emailProperty.Format = "email";
                        emailProperty.Example = new OpenApiString("user@example.com"); 
                        }
                if (schema.Properties.TryGetValue("name", out var nameProperty))
                    { nameProperty.Example = new OpenApiString("User123"); }

                 if (schema.Properties.TryGetValue("password", out var passwordProperty))
                    {   passwordProperty.Example = new OpenApiString("Password123"); }

            }
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

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminService>();

builder.Services.AddScoped<IOrderCounterRepository, OrderCounterRepository>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

//swagger Enum
builder.Services.AddControllers().AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(
                        new JsonStringEnumConverter());
                });

//JWT Авторизация
var jwtKey = builder.Configuration.GetValue<string>("Jwt:Key");

//Проверка на пустоту
if (string.IsNullOrWhiteSpace(jwtKey)) { throw new Exception("JWT Key is missing in appsettings.json"); } 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });

builder.Services.AddScoped<JwtTokenService>();

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

//Автоматическое создание Админа
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (!db.Users.Any(x => x.Role == Role.Admin.ToString()))
    {
        var admin = new User
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Email = "admin@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = Role.Admin.ToString()
        };

        db.Users.Add(admin);
        db.SaveChanges();
    }
}

app.UseHttpsRedirection();

app.UseAuthentication(); //используется для аунтификации(проверки токена)
app.UseAuthorization();  //используется авторизация
app.MapControllers();



app.Run();

