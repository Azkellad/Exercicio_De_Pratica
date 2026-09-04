using Mercado.Data;
using Mercado.Routes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddScoped<AppDbContext>();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapProdutoRoutes();
app.MapNotaRoutes();
app.UseCors("AllowAngular");
app.UseHttpsRedirection();
app.Run();
