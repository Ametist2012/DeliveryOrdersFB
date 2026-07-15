using DeliveryOrders.Models;
using Microsoft.EntityFrameworkCore;

namespace DeliveryOrders.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<User> Users => Set<User>();
    public DbSet<OrderCounter> OrderCounters => Set<OrderCounter>();


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>()
                .HasIndex(x => x.OrderNumber)
                .IsUnique();
            
            modelBuilder.Entity<Order>()
                .Property(x => x.CargoWeight)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Order>()
                .HasIndex(x => x.CreatedAt);

            modelBuilder.Entity<Order>()
                .HasIndex(x => x.UserId);
            
            modelBuilder.Entity<OrderCounter>()
                .HasKey(x => x.Date);

            modelBuilder.Entity<Order>()
                .HasOne(x => x.User)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.UserId);
        }
}