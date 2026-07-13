using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DeliveryOrders.Services;
using DeliveryOrders.DTOs.Auth;
using System.Threading.Tasks;

namespace DeliveryOrders.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService) { _authService = authService; }



    [AllowAnonymous] //Доступны без авторизации
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var success = await _authService.Register(request);
        if (!success)
        {
            return Problem( title: "Registration failed",
                            detail: "A user with this email already exists.",
                            statusCode: StatusCodes.Status400BadRequest);
        }

            return Ok( new {message = "User registered successfully"});
    }



    [AllowAnonymous] 
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var token = await _authService.Login(request);
        if (token == null)
        {
            return Problem( title: "Authentication failed",
                            detail: "Invalid email or password.",
                            statusCode: StatusCodes.Status401Unauthorized);
        }
        
        return Ok(new { token });
    }

}


