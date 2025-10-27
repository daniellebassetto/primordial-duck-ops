using System.Reflection;

namespace PrimordialDuckOperation.Domain.Entities
{
    public class BaseSetProperty<TClass>
     where TClass : BaseSetProperty<TClass>
    {
        public TClass SetProperty<T>(string propertyName, T propertyValue)
        {
            var property = GetType().GetProperty(propertyName, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);
            property?.SetValue(this, propertyValue);
            return (this as TClass)!;
        }
    }
}
