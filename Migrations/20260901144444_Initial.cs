using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mercado.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Notas",
                columns: table => new
                {
                    N = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Status = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notas", x => x.N);
                });

            migrationBuilder.CreateTable(
                name: "Produtos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false),
                    Descricao = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Saldo = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Produtos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItensNota",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NotaId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProdId = table.Column<int>(type: "INTEGER", nullable: false),
                    Qntd = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItensNota", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItensNota_Notas_NotaId",
                        column: x => x.NotaId,
                        principalTable: "Notas",
                        principalColumn: "N",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItensNota_Produtos_ProdId",
                        column: x => x.ProdId,
                        principalTable: "Produtos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItensNota_NotaId",
                table: "ItensNota",
                column: "NotaId");

            migrationBuilder.CreateIndex(
                name: "IX_ItensNota_ProdId",
                table: "ItensNota",
                column: "ProdId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItensNota");

            migrationBuilder.DropTable(
                name: "Notas");

            migrationBuilder.DropTable(
                name: "Produtos");
        }
    }
}
