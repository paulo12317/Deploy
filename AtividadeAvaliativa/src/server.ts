import express, { Application, Request, Response } from "express";
import AppDataSource from "./database/data-source";
import routesUser from "./routes/RoutesUser";
import livroRoutes from "./routes/RoutesLivros";

import cors from "cors";
import path from "path";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "localhost:3000",
  })
);

app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/cadastrar.html"));
});

AppDataSource.initialize()
  .then(() => {
    app.use("/api", routesUser);
    app.use(livroRoutes);
    app.listen(3000, () => console.log("Server rodando na porta 3000"));
  })
  .catch((error) => console.log(error));
