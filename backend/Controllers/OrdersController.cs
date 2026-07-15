using Microsoft.AspNetCore.Authorization;
using DeliveryOrders.DTOs;
using DeliveryOrders.Services.Interfaces;
using DeliveryOrders.Validators.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryOrders.Controllers;


[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;
    private readonly IOrderValidator _validator;
    private readonly IOrderQueryValidator _validatorGet;

    public OrdersController(IOrderService service, 
                            IOrderValidator validator,
                            IOrderQueryValidator validatorGet)
    {
        _service = service;
        _validator = validator;
        _validatorGet = validatorGet;
    }


    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create(CreateOrderRequest request)
    {
        var errors = _validator.Validate(request);

        if (errors.Count > 0)
        {   foreach (var error in errors)
                {   foreach (var message in error.Value) { ModelState.AddModelError(error.Key, message); } }
            
            return ValidationProblem(ModelState); 
        }

        var order = await _service.CreateAsync(request);
        return Ok(order);
    }


    [HttpGet]
    public async Task<ActionResult<List<OrderResponse>>> GetSortAll([FromQuery] OrderQueryRequest request)
    {
        var errors = _validatorGet.Validate(request);

        if (errors.Count > 0)
        {   foreach (var error in errors)
                {   foreach (var message in error.Value) { ModelState.AddModelError(error.Key, message); } }
            
            return ValidationProblem(ModelState); 
        }

        var orders = await _service.GetPagedSAsync(request);
        return Ok(orders);
    }
}