using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class modelRefactorFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "Wallets",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "Wallets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Wallets",
                table: "Wallets");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Wallets");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Wallets",
                type: "int",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");
        }
    }
}
