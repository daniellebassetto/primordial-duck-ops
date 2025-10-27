using Microsoft.AspNetCore.Identity;
using PrimordialDuckOperation.Domain.Enums;

namespace PrimordialDuckOperation.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public UserRoleEnum Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}