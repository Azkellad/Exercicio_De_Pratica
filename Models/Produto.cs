namespace Mercado.Models;

public class ProdutoModel
{
    public Guid Id {get; init;}
    public string Produto {get; private set;}

    public string Descricao {get; private set;}
    public int Quantidade {get; private set;}

    public ProdutoModel(string produto, int quantidade, string descricao)
    {
        if(string.IsNullOrWhiteSpace(produto))
            throw new ArgumentException("Produto deve está preenchido", nameof(produto));
        
        if (quantidade < 0)
            throw new ArgumentException("Quantidade não pode ser negativa", nameof(quantidade));
        
        Id = Guid.NewGuid();
        Produto = produto;
        Quantidade = quantidade;
        Descricao = descricao;
    }

    public void AtualizarProduto(string novoProduto)
    {
        if (string.IsNullOrWhiteSpace(novoProduto))
            throw new ArgumentException("Produto é obrigatório", nameof(novoProduto));
        
        Produto = novoProduto;
    }

    public void AdicionarEstoque(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Deve ser maior que zero", nameof(quantidade));
        Quantidade += quantidade;
    }

    public void BaixarEstoque(int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException("Quantidade deve ser maior que zero", nameof(quantidade));
        
        if (quantidade > Quantidade)
            throw new InvalidOperationException($"Quantidade insuficiente. Em estoque tem {Quantidade}");
        Quantidade -= quantidade;
    }
}