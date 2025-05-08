using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CorepetitorApi.Migrations
{
    /// <inheritdoc />
    public partial class AdditionalTutorRatingValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AverageRating",
                table: "Tutors",
                type: "decimal(3,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Rating",
                table: "TutorModules",
                type: "decimal(3,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Tutors");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "TutorModules");
        }
    }
}
