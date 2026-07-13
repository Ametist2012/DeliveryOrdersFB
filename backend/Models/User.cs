namespace DeliveryOrders.Models;

public class User
{
    public Guid Id { get; set; }  //Уникальный ID (GUID)
    public string Name { get; set; } = string.Empty; //Имя пользователя
    public string Email { get; set; } = string.Empty; //e-mail, он же Login
    public string PasswordHash { get; set; } = string.Empty; //Хеш-пароля, т.к. пароли не хранят в БД
    public string Role { get; set; } = ""; //Роли - user, admin
}