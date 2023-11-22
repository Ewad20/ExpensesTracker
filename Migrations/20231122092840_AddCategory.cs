using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class AddCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Categories_CategoryId",
                table: "Expenditures");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_CategoryId",
                table: "Expenditures");
        }
    }
}
