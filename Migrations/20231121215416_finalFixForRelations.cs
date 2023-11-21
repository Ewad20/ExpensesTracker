using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace _2023pz_trrepo.Migrations
{
    /// <inheritdoc />
    public partial class finalFixForRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Incomes_WalletId",
                table: "Incomes",
                column: "WalletId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenditures_WalletId",
                table: "Expenditures",
                column: "WalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenditures_Wallets_WalletId",
                table: "Expenditures",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Incomes_Wallets_WalletId",
                table: "Incomes",
                column: "WalletId",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Wallets_Users_UserId",
                table: "Wallets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenditures_Wallets_WalletId",
                table: "Expenditures");

            migrationBuilder.DropForeignKey(
                name: "FK_Incomes_Wallets_WalletId",
                table: "Incomes");

            migrationBuilder.DropForeignKey(
                name: "FK_Wallets_Users_UserId",
                table: "Wallets");

            migrationBuilder.DropIndex(
                name: "IX_Wallets_UserId",
                table: "Wallets");

            migrationBuilder.DropIndex(
                name: "IX_Incomes_WalletId",
                table: "Incomes");

            migrationBuilder.DropIndex(
                name: "IX_Expenditures_WalletId",
                table: "Expenditures");
        }
    }
}
