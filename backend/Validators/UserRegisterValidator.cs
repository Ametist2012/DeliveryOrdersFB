using System.Text.RegularExpressions;
using DeliveryOrders.DTOs.Auth;

namespace DeliveryOrders.Validators.Interfaces;

public class UserRegisterValidator : IUserRegisterValidator
{
    public Dictionary<string, List<string>> Validate(RegisterRequest request)
    {
        var errors = new Dictionary<string, List<string>>();

        ValidateName(request, errors);
        ValidateEmail(request, errors);
        ValidatePassword(request, errors);

        return errors;
    }



    private static void ValidateName(
        RegisterRequest request,
        Dictionary<string, List<string>> errors)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            AddError(errors, nameof(request.Name),
                    "The Name field is required.");
            return;
        }


        if (request.Name.Length < 6 || request.Name.Length > 13)
        {
            AddError(errors, nameof(request.Name),
                    "The Name length must be between 6 and 13 characters.");
        }

        if (!Regex.IsMatch(request.Name, "^[a-zA-Z0-9]+$"))
        {
            AddError(errors, nameof(request.Name),
                    "The Name can contain only latin letters and numbers.");
        }
    }



    private static void ValidateEmail(
        RegisterRequest request,
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



    private static void ValidatePassword(
        RegisterRequest request,
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



    private static void AddError(Dictionary<string, List<string>> errors,string key, string message)
    {
        if (!errors.ContainsKey(key)) { errors[key] = []; }
        errors[key].Add(message);
    }
}