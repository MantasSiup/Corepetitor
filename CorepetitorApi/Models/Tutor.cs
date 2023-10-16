namespace CorepetitorApi.Models
{
    public class Tutor
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string PhoneNumber { get; set; }

        public string Address { get; set; }

        public string City { get; set; }

        public ICollection<Student> Students { get; set; }
        public ICollection<Module> Modules { get; set; }

    }
}
