using DeliveryOrders.Data;
using DeliveryOrders.Models.Enums;
using DeliveryOrders.Models;
using DeliveryOrders.Repositories.Interfaces;
using System.Threading.Tasks;

namespace DeliveryOrders.Services;

public class AdminService
{

    private readonly IUserRepository _userRepository;
    public AdminService(IUserRepository userRepository) { _userRepository = userRepository; }

    public async Task<List<User>> GetUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }


    public async Task<bool> DelUserByIdAsync(Guid id)
    {
        var curUser = await _userRepository.GetByIdAsync(id);
        if (curUser == null) return false;

        await _userRepository.DeleteAsync(curUser);
        await _userRepository.SaveChangesAsync();
            return true;
    }
}