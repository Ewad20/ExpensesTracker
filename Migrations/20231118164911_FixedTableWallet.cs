using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class FixedTableWallet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Icon",
                table: "Wallets");

            migrationBuilder.RenameColumn(
                name: "WalletId",
                table: "Wallets",
                newName: "Id");

            migrationBuilder.AddColumn<long>(
                name: "IconId",
                table: "Wallets",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconId",
                table: "Wallets");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Wallets",
                newName: "WalletId");

            migrationBuilder.AddColumn<string>(
                name: "Icon",
                table: "Wallets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
