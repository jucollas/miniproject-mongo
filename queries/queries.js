// =====================================
// CONSULTAS PARA EL MINIPROYECTO MONGODB
// =====================================

// 1. Listar los intercambios que ha propuesto el usuario XXX y que están pendientes por negociar.
// Resultado ordenado por antigüedad (los más antiguos primero).
db.trades.find(
  { proposed_by: "XXX", status: "open" }
).sort({ date: 1 });


// 2. Liste para cada usuario la cantidad de veces que ha hecho intercambios que habían sido propuestos por otro usuario.
db.complete_trades.aggregate([
  {
    $group: {
      _id: "$with_user", // usuario que aceptó el intercambio
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
]);


// 3. Consulta relevante que accede a datos de un documento anidado.
// Obtener todos los libros propuestos cuyo estado (calidad) sea "como nuevo".
db.trades.find(
  { "book.condition": "Nuevo" }
);


// 4. Consulta que requiere hacer UNWIND sobre datos en un arreglo.
// Lista la cantidad de veces que ha aparecido cada etiqueta (tag) en los libros ofrecidos en propuestas de intercambio.
// Para ello, se descompone el arreglo de etiquetas de cada libro (book.tags) y se agrupa por cada etiqueta individual, contando su frecuencia total en la colección.
db.trades.aggregate([
  { $unwind: "$book.tags" },
  { $group: {
    _id: "$book.tags",
    count: { $sum: 1 }
  }}
])



// 5. Listar el/los títulos que han sido intercambiados más veces.
// Busca por título del libro propuesto en complete_trades.
db.complete_trades.aggregate([
  {
    $group: {
      _id: "$proposed_book.title",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  },
  {
    $limit: 5 // puedes ajustar este número si deseas más títulos
  }
]);
