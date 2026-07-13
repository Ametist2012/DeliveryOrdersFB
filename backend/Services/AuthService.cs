using DeliveryOrders.DTOs.Auth;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using BCrypt.Net;
using DeliveryOrders.Models.Enums;
using System.Threading.Tasks;

namespace DeliveryOrders.Services;

public class AuthService
{
    private readonly JwtTokenService _jwt;
    private readonly IUserRepository _userRepository;
    public AuthService(
        JwtTokenService jwt,
        IUserRepository userRepository) 
    {   
        _jwt = jwt; 
        _userRepository = userRepository;
    }
    
    
    public async Task<bool> Register(RegisterRequest request)
    {
        var userExists = await _userRepository.GetByEmailAsync(request.Email);
        if (userExists != null) return false;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.User.ToString()
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

            return true;
    }

    

    public async Task<string?> Login(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null) return null;

        bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordValid) return null;

            return _jwt.CreateToken(user);
    }
}