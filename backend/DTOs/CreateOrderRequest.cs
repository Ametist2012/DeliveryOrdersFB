using System.ComponentModel.DataAnnotations;

namespace DeliveryOrders.DTOs;

public class CreateOrderRequest
{
    public required string SenderCity { get; set; }

    public required string SenderAddress { get; set; }

    public required string ReceiverCity { get; set; }

    public required string ReceiverAddress { get; set; }

    public decimal CargoWeight { get; set; }

    public DateOnly CargoPickupDate { get; set; }
}