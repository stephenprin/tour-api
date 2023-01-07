"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
//routes
const tourRoute_1 = __importDefault(require("./routes/tourRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
app.use('/api/v1/tours', tourRoute_1.default);
app.use('/api/v1/users', userRoute_1.default);
app.use((req, res, next) => {
    console.log(req.headers);
    next();
});
//error handling
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});
//connecting too database and server
const PORT = process.env.PORT || 3500;
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(process.env.DATABASE_URL, () => {
    try {
        app.listen(PORT, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
        });
        console.log('Connected to Database');
    }
    catch (err) {
        console.log(err);
    }
});
