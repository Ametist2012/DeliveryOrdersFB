using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DeliveryOrders.Services;
using DeliveryOrders.DTOs.Auth;
using System.Threading.Tasks;
using DeliveryOrders.Validators;
using DeliveryOrders.Validators.Interfaces;

namespace DeliveryOrders.Controllers;


[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserRegisterValidator _validator;
    private readonly IUserLoginValidator _loginValidator;
    public AuthController(AuthService authService,
        IUserRegisterValidator validator,
        IUserLoginValidator loginValidator) 
            { _authService = authService;
              _validator = validator;
              _loginValidator = loginValidator; }


    [AllowAnonymous] //Доступны без авторизации
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var errors = _validator.Validate(request);
        if(errors.Count > 0) 
        {   foreach(var error in errors)
            { 
                foreach(var message in error.Value)
                    { ModelState.AddModelError(error.Key,message);}
            }
            return ValidationProblem(ModelState);
        }

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
        var errors = _loginValidator.Validate(request);
        if(errors.Count > 0) 
        {   foreach(var error in errors)
            { 
                foreach(var message in error.Value)
                    { ModelState.AddModelError(error.Key,message);}
            }
            return ValidationProblem(ModelState);
        }

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


