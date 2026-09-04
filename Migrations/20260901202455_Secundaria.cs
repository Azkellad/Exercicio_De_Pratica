using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mercado.Migrations
{
    /// <inheritdoc />
    public partial class Secundaria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Saldo",
                table: "Produtos",
                newName: "Quantidade");

            migrationBuilder.RenameColumn(
                name: "Qntd",
                table: "ItensNota",
                newName: "Quantidade");

            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                table: "Produtos",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<string>(
                name: "Produto",
                table: "Produtos",
                type: "TEXT",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProdId",
                table: "ItensNota",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Produto",
                table: "Produtos");

            migrationBuilder.RenameColumn(
                name: "Quantidade",
                table: "Produtos",
                newName: "Saldo");

            migrationBuilder.RenameColumn(
                name: "Quantidade",
                table: "ItensNota",
                newName: "Qntd");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Produtos",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<int>(
                name: "ProdId",
                table: "ItensNota",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT");
        }
    }
}
