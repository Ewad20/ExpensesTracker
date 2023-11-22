using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class revertFKBeforeProduction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Categories_CategoryId",
                table: "Expenditures");

            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_Categories_CategoryId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_CategoryId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_CategoryId",
                table: "Expenditures");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Incomes_CategoryId",
                table: "Incomes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenditures_CategoryId",
                table: "Expenditures",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenditures_Categories_CategoryId",
                table: "Expenditures",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Incomes_Categories_CategoryId",
                table: "Incomes",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
