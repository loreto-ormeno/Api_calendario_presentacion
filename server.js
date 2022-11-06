const express = require("express");
const joyas = require("./data/joyas.js");
const app = express();
app.listen(3000, () => console.log("Your app listening on port 3000"));

app.get("/", (req, res) => {
  res.send("Oh wow! this is working =)");
});

//1
app.get("/api/v1/joyas", (req, res) => {
  res.json(joyas);
  res.status(200);
  res.end();
});

//2
app.get("/api/v2/joyas", (req, res) => {
  let joyas2 = joyas.results.map((joya) => {
    return {
      id: joya.id,
      stock: joya.stock,
      nombre: joya.name,
      valor: joya.value,
      caracteristicas: {
        modelo: joya.model,
        categoria: joya.category,
        metal: joya.metal,
        cadena: joya.cadena,
        medida: joya.medida,
      },
    };
  });
  res.json(joyas2);
  res.status(200);
  res.end();
});

//3
app.get("/api/v2/joyas/categoria/:categoria", (req, res) => {
  const joyas2 = joyas.results.filter(
    (joya) => joya.category === req.params.categoria
  );
  res.json(joyas2);
  res.status(200);
  res.end();
});

//4
app.get("/api/v2/joyas/metal/:metal/stock/:stock", (req, res) => {
  const joyas2 = joyas.results.filter(
    (joya) => joya.metal === req.params.metal && joya.stock >= req.params.stock
  );
  res.json(joyas2);
  res.status(200);
  res.end();
});

//5
app.get("/api/v2/joyas/:id", (req, res) => {
  try {
    const joya = joyas.results.find((joya) => joya.id == req.params.id);
    if (joya != undefined) {
      res.json(joya);
      res.status(200);
      res.end();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.json({ error: `No existe la joya con id ${req.params.id}` });
    res.status(500);
    res.end();
  }
});

app.get("/api/v3/joyas",  async (req, res) => {
  try {
    let arrayJoyas = [];
    let pageprevius;
    let pagenext;
    let pages;
    let currentPage;
    if (req.query.orden == "desc") {
       arrayJoyas = joyas.results.reverse();
    }
    if (req.query.orden == "asc") {
      arrayJoyas = joyas.results;
   }
    if (req.query.page) {
      pages = joyas.results.length / req.query.size;
      pageprevius = req.query.page > 1 ? req.query.page - 1 : "";
      pagenext = req.query.page < pages ? parseInt(req.query.page) + 1 : pages;
      currentPage = req.query.page;

      currentPage == 1
        ? (arrayJoyas = arrayJoyas.slice(0, req.query.size))
        : (arrayJoyas = arrayJoyas.slice((req.query.size * (currentPage - 1)), (req.query.size * currentPage)));
    }

    res.json(
      {
        currentPage: currentPage,
        prevPage : pageprevius,
        nextPage : pagenext,
        totalPages: Math.ceil(pages),
        data: arrayJoyas
      });
    res.status(200);
    res.end();

  } catch (error) {
    res.status(500);
    res.json({ error: `No se pudo completar la llamada` });
    res.end();
  }
});
