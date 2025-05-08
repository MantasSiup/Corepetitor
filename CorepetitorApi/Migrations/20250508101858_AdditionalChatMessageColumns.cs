using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CorepetitorApi.Migrations
{
    /// <inheritdoc />
    public partial class AdditionalChatMessageColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecipientId",
                table: "ChatMessages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RecipientRole",
                table: "ChatMessages",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecipientId",
                table: "ChatMessages");

            migrationBuilder.DropColumn(
                name: "RecipientRole",
                table: "ChatMessages");
        }
    }
}
