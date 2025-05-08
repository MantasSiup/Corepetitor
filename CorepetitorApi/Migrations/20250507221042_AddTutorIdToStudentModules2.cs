using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CorepetitorApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTutorIdToStudentModules2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TutorId",
                table: "StudentModules",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TutorId",
                table: "StudentModules");
        }
    }
}
