namespace Mercado.Models;

public enum StatusNota
{
    Aberta,
    Fechada
}

public class ItemNotaModel
{
    public int Id {get; private set;}
    public int NotaId {get; private set;}
    public Guid ProdId { get; set;}
    public int Quantidade {get; private set;}

    public ItemNotaModel(Guid prodId, int quantidade)
    {
        if (quantidade <= 0)
            throw new ArgumentException ("Quantidade deve ser maior que zero.", nameof(quantidade));
        
        ProdId = prodId;
        Quantidade = quantidade;

    }

    public void AtualizarQntd(int novaQntd)
    {
        if (novaQntd <= 0)
            throw new ArgumentException ("Quantidade deve ser maior que zero", nameof(novaQntd));

        Quantidade = novaQntd;
    }

}

public class NotaModel
{
    private readonly List<ItemNotaModel> itens = new();

    public int N {get; set;}
    public StatusNota Status {get; private set;}
    public IReadOnlyList<ItemNotaModel> Itens => itens.AsReadOnly();

    private NotaModel(){}
    public NotaModel(StatusNota statusInicial = StatusNota.Aberta)
    {
        Status = statusInicial;
    }

    public void AdicionarProd(Guid prodId, int quantidade)
    {
        if(Status == StatusNota.Fechada)
            throw new InvalidOperationException("Não é possivel adicionar produto, a nota está fechada");
        
        var itemExistente = itens.FirstOrDefault(i=> i.ProdId == prodId);
        if (itemExistente is not null)
        {
            itemExistente.AtualizarQntd(itemExistente.Quantidade + quantidade);
            return;
        }

        itens.Add(new ItemNotaModel(prodId, quantidade));

    }

    public void Fechar()
    {
        if (itens.Count==0)
            throw new InvalidOperationException("Não é possivel fechar nota, está vazia");
        
        Status=StatusNota.Fechada;
    }
}