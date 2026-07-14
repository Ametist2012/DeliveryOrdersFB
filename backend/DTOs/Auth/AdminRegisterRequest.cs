using System.ComponentModel.DataAnnotations; //Для автопроверки валидности данных

namespace DeliveryOrders.DTOs.Auth;

public class AdminRegisterRequest
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";

    [Required]
    public string Role { get; set; } = "";
}