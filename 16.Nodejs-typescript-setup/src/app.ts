import dotenv from 'dotenv';
dotenv.config();
import express, {Express, NextFunction, Request, Response} from 'express';

const app : Express = express();
const PORT = process.env.PORT;

//Middleware
app.use(express.json());

interface customRequest extends Request {
startTime? : number
}

app.use((req : customRequest, res : Response, next : NextFunction) => {
    req.startTime = Date.now();
    next();
})

//route
app.get("/", (req: Request, res : Response) => {
    res.send("Server is now running")
})

//post route -> 
// -> /user/:id?name -> Request <{}, {}, {}, {}> 
// {} -> 1st (params)
// {} -> 2nd (requets)
// {} -> 3rd (response)
// {} -> 4th (query) 

interface User {
    name : string,
    email: string,

}

app.post("/user", (req: Request<{}, {}, User>, res: Response) => {
  const { name, email } = req.body;

  res.status(200).json({
    message: `User ${name} with email ${email} created successfully!`,
  });
});


app.post("/user/:id", (req: Request<{id: string}>, res: Response) => {
  const { id } = req.params;

  res.status(200).json({
    userid : id,
  });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

