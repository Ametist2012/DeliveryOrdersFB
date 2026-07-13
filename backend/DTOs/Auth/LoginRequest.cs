using System.ComponentModel.DataAnnotations; //Для автопроверки валидности данных

namespace DeliveryOrders.DTOs.Auth;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    [Required]
    public string Password { get; set; } = "";
}