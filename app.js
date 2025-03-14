import express from 'express';
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';
import './models/user.js'
import path from 'path';
import session from 'express-session';
import expressReactViews from 'express-react-views';
import { fileURLToPath } from 'url';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('src', path.join(__dirname, 'src')); 
app.set('view engine', 'jsx');
app.engine('jsx', expressReactViews.createEngine());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'))
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT);