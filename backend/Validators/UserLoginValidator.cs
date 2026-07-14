using System.Text.RegularExpressions;
using DeliveryOrders.DTOs.Auth;

namespace DeliveryOrders.Validators.Interfaces;

public class UserLoginValidator : IUserLoginValidator
{
    public Dictionary<string, List<string>> Validate(LoginRequest request)
    {
        var errors = new Dictionary<string, List<string>>();

        ValidateEmail(request, errors);
        ValidatePassword(request, errors);

        return errors;
    }



    private static void ValidateEmail(
        LoginRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            AddError(errors, nameof(request.Email),
                    "The Email field is required.");
            return;
        }


        if (!Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
        {
            AddError(errors, nameof(request.Email),
                    "The Email format is invalid.");
        }
    }



    private static void ValidatePassword(LoginRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.Password))
        {
            AddError(errors, nameof(request.Password),
                    "The Password field is required.");
            return;
        }


        if (request.Password.Length < 6 || request.Password.Length > 26)
        {
            AddError(errors, nameof(request.Password),
                    "The Password length must be between 6 and 26 characters.");
        }


        if (!Regex.IsMatch(request.Password, @"^(?=.*[A-Za-z])(?=.*\d).+$"))
        {
            AddError(errors, nameof(request.Password),
                    "The Password must contain at least one letter and one number.");
        }
    }



    private static void AddError( Dictionary<string, List<string>> errors, string key, string message)
    {
        if (!errors.ContainsKey(key)) { errors[key] = []; }
        errors[key].Add(message);
    }
}