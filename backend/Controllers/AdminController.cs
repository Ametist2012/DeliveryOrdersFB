using Microsoft.AspNetCore.Mvc;
using DeliveryOrders.Services;
using Microsoft.AspNetCore.Authorization;
//using DeliveryOrders.DTOs.Auth;
//using System.Threading.Tasks;

namespace DeliveryOrders.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService) { _adminService = adminService; }



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
}