namespace DeliveryOrders.DTOs;

public class UserResponce
{
    public Guid Id { get; set; }  //Уникальный ID (GUID)
    public string Name { get; set; } = string.Empty; //Имя пользователя
    public string Email { get; set; } = string.Empty; //e-mail, он же Login
    public string Role { get; set; } = ""; //Роли - user, admin
}