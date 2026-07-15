using DeliveryOrders.Models;

namespace DeliveryOrders.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);          //Поиск по Guid пользователя
    Task<User?> GetByEmailAsync(string email);  //Поиск по email пользователя
    Task<bool> ExistsAsync(Guid id);            //Проверка по Guid - существует ли пользователь
    Task<bool> EmailExistsAsync(string email);  //Проверка по email - существует ли пользователь
    Task<List<User>> GetAllAsync();             //Получить всех пользователей
    Task<List<User>> GetAdminsAsync();          //Получить всех пользователей с ролью Admin
    Task AddAsync(User user);                   //Добавить пользователя
    Task DeleteAsync(User user); 
    Task SaveChangesAsync();
}