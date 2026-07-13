using Microsoft.AspNetCore.Mvc;
using DeliveryOrders.Services;
using Microsoft.AspNetCore.Authorization;
using DeliveryOrders.DTOs.Auth;
using DeliveryOrders.Validators;

namespace DeliveryOrders.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;
    private readonly IAdminRegisterValidator _validator;

    public AdminController(AdminService adminService,
            IAdminRegisterValidator validator) 
            { _adminService = adminService;
              _validator = validator; }



    [Authorize(Roles = "Admin")]
    [HttpGet("users")]
    public async Task<IActionResult> ListUsers()
    {
        var users = await _adminService.GetUsersAsync();
            return Ok(users);
    }


    [Authorize(Roles = "Admin")]
    [HttpDelete("users/{userId:guid}")]
    public async Task<IActionResult> DeleteUser(Guid userId)
    {
        var result = await _adminService.DelUserByIdAsync(userId);
        if (!result)
        {
            return Problem( title: "User not found",
                            detail: $"User with id {userId} does not exist.",
                            statusCode: StatusCodes.Status404NotFound);
        }
        return Ok(new { message = "User deleted successfully",
                        userId });
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("users")]
    public async Task<IActionResult> RegUser(AdminRegisterRequest request)
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

        var result = await _adminService.AddUserAsync(request);
        if (!result)
        {
            return Problem( title: "Registration User failed",
                            detail: "A user with this email already exists.",
                            statusCode: StatusCodes.Status400BadRequest);
        }
            return Ok(new {message = "User registered successfully"});
    }
}