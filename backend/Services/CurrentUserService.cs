using System.Security.Claims;
using DeliveryOrders.Services.Interfaces;

namespace DeliveryOrders.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }


    private ClaimsPrincipal? User
    {
        get 
        { 
            return _httpContextAccessor.HttpContext?.User; 
        }
    }  

    public Guid UserId
    {
        get 
        { 
            var id = User?.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(id, out var userId)? userId : Guid.Empty; 
        }
    }

    public string Email
    {
        get 
        { 
            return User?.FindFirstValue(ClaimTypes.Email) ?? string.Empty; 
        }
    }
    
    

    public string Role
    {
        get
        {
            return User?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        }
    }

    public bool IsAuthenticated
    {
        get
        {
            return User?.Identity?.IsAuthenticated ?? false;
        }
    }

}