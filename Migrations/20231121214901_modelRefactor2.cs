using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class modelRefactor2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Wallets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Wallets",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets",
                column: "Id");
        }
    }
}
