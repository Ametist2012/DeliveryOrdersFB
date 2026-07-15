namespace DeliveryOrders.Repositories.Interfaces;

public interface IOrderCounterRepository
{
    Task<int> GetNextNumberAsync(DateOnly date);
}