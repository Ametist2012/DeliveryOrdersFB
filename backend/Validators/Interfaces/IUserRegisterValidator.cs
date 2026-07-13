using DeliveryOrders.DTOs.Auth;

namespace DeliveryOrders.Validators.Interfaces;

public interface IUserRegisterValidator
{
    Dictionary<string, List<string>> Validate(RegisterRequest request);
}