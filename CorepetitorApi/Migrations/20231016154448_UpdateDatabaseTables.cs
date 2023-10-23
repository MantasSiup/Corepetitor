using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CorepetitorApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Modules_ModuleId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_Tutors_TutorId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_ModuleId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_TutorId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "ModuleId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "Modules");

            migrationBuilder.CreateTable(
                name: "StudentModules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    ModuleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentModules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentModules_Modules_ModuleId",
                        column: x => x.ModuleId,
                        principalTable: "Modules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentModules_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_StudentModules_ModuleId",
                table: "StudentModules",
                column: "ModuleId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentModules_StudentId",
                table: "StudentModules",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentModules");

            migrationBuilder.AddColumn<int>(
                name: "ModuleId",
                table: "Students",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StudentId",
                table: "Modules",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Students_ModuleId",
                table: "Students",
                column: "ModuleId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_TutorId",
                table: "Students",
                column: "TutorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Modules_ModuleId",
                table: "Students",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Tutors_TutorId",
                table: "Students",
                column: "TutorId",
                principalTable: "Tutors",
                principalColumn: "Id");
        }
    }
}
