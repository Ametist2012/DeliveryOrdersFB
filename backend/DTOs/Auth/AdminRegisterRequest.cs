using System.ComponentModel.DataAnnotations; //Для автопроверки валидности данных

namespace DeliveryOrders.DTOs.Auth;

public class AdminRegisterRequest
{
    [Required]
    [MinLength(6)]
    [MaxLength(13)]
    [RegularExpression("^[a-zA-Z0-9]+$")] //Только Латинские буквы и цифры
    public string Name { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    [Required]
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d).{6,}$")]
    [MinLength(6)]
    [MaxLength(26)] 
    public string Password { get; set; } = "";

    public string Role { get; set; } = "";
}