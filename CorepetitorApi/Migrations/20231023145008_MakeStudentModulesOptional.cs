using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CorepetitorApi.Migrations
{
    /// <inheritdoc />
    public partial class MakeStudentModulesOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentModules_Modules_ModuleId",
                table: "StudentModules");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentModules_Students_StudentId",
                table: "StudentModules");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentModules_Modules_ModuleId",
                table: "StudentModules",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentModules_Students_StudentId",
                table: "StudentModules",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentModules_Modules_ModuleId",
                table: "StudentModules");

            migrationBuilder.DropForeignKey(
                name: "FK_StudentModules_Students_StudentId",
                table: "StudentModules");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentModules_Modules_ModuleId",
                table: "StudentModules",
                column: "ModuleId",
                principalTable: "Modules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_StudentModules_Students_StudentId",
                table: "StudentModules",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
