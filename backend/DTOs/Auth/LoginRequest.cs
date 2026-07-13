using System.ComponentModel.DataAnnotations; //Для автопроверки валидности данных

namespace DeliveryOrders.DTOs.Auth;

public class LoginRequest
{
    [Required]
    public string Email { get; set; } = "";
    [Required]
    public string Password { get; set; } = "";
}