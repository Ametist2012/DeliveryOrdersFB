using DeliveryOrders.DTOs;
using DeliveryOrders.Services;
using DeliveryOrders.Validators;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryOrders.Controllers;


[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;
    private readonly IOrderValidator _validator;

    public OrdersController(IOrderService service, IOrderValidator validator)
    {
        _service = service;
        _validator = validator;
    }


    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest request)
    {
        var errors = _validator.Validate(request);

        if (errors.Count > 0)
        {
            foreach (var error in errors)
            {   
                foreach (var message in error.Value) { ModelState.AddModelError(error.Key, message); }
            }

            return ValidationProblem(ModelState);
        }

        var order = await _service.CreateAsync(request);

        return Ok(order);
    }


    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetAll()
    {
        var orders = await _service.GetAllAsync();

        return Ok(orders);
    }
}