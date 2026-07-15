using System.Threading.Tasks;
using DeliveryOrders.Data;
using DeliveryOrders.Models;
using DeliveryOrders.Models.Enums;
using DeliveryOrders.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Repositories;

public class UserRepository : IUserRepository

{

    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) { _db = db; }

    // получить пользователя по id
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return _db.Users.FirstOrDefault(u => u.Id == id);
    }

    // получить по email
    public async Task<User?> GetByEmailAsync(string email)
    {
        return _db.Users.FirstOrDefault(u => u.Email == email);
    }

    // проверить существует ли пользователь
    public async Task<bool> ExistsAsync(Guid id)
    {
        return _db.Users.Any(u => u.Id == id);
    }

    // проверка email
    public async Task<bool> EmailExistsAsync(string email)
    {
        return _db.Users.Any(e => e.Email == email);
    }

    // получить всех пользователей
    public async Task<List<UserResponce>> GetAllAsync()
    {
        return await _db.Users
                    .Select(i => new UserResponce
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Email = i.Email,
                        Role = i.Role
                    }).ToListAsync();
    }

    // только админы
    public async Task<List<UserResponce>> GetAdminsAsync()
    {
        return await _db.Users
                    .Where(i => i.Role == Role.Admin.ToString())
                    .Select(u => new UserResponce
                    {
                        Id = u.Id,
                        Name = u.Name,
                        Email = u.Email,
                        Role = u.Role
                    }).ToListAsync();
    }

    // добавить пользователя
    public async Task AddAsync(User user)
    {
        _db.Users.Add(user);
    }

    public async Task DeleteAsync(User user)
    {
        _db.Users.Remove(user);
    }

    // сохранить изменения
    public async Task SaveChangesAsync()
    {
        _db.SaveChanges();
    }
}