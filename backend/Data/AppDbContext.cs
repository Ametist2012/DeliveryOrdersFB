using DeliveryOrders.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>()
            .HasIndex(x => x.OrderNumber)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .Property(x => x.CargoWeight)
            .HasPrecision(10, 2);
    }
}