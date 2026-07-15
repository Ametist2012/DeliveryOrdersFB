using DeliveryOrders.Data;
using DeliveryOrders.Models.Enums;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using System.Threading.Tasks;
using DeliveryOrders.DTOs.Auth;
using DeliveryOrders.DTOs;

namespace DeliveryOrders.Services;

public class AdminService
{

    private readonly IUserRepository _userRepository;
    public AdminService(IUserRepository userRepository) { _userRepository = userRepository; }

    public async Task<List<UserResponce>> GetUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(i => new UserResponce
                                    {
                                        Id = i.Id,
                                        Name = i.Name,
                                        Email = i.Email,
                                        Role = i.Role
                                    }).ToList();
    }


    public async Task<bool> DelUserByIdAsync(Guid id)
    {
        var curUser = await _userRepository.GetByIdAsync(id);
        if (curUser == null) return false;

        await _userRepository.DeleteAsync(curUser);
        await _userRepository.SaveChangesAsync();
            return true;
    }

    public async Task<bool> AddUserAsync(AdminRegisterRequest request)
    {
        var userExists = await _userRepository.GetByEmailAsync(request.Email);
        if (userExists != null) return false;

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

            return true;    
    }
}