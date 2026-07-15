using DeliveryOrders.Models;

namespace DeliveryOrders.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);          //Поиск по Guid пользователя
    Task<User?> GetByEmailAsync(string email);  //Поиск по email пользователя
    Task<bool> ExistsAsync(Guid id);            //Проверка по Guid - существует ли пользователь
    Task<bool> EmailExistsAsync(string email);  //Проверка по email - существует ли пользователь
    Task<List<UserResponce>> GetAllAsync();     //Получить всех пользователей (чтобы не светить Хеши паролей)
    Task<List<UserResponce>> GetAdminsAsync();  //Получить всех пользователей с ролью Admin (чтобы не светить Хеши паролей)
    Task AddAsync(User user);                   //Добавить пользователя
    Task DeleteAsync(User user); 
    Task SaveChangesAsync();
}