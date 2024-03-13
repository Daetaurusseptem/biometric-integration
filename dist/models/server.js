"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const usuario_1 = __importDefault(require("../routes/usuario"));
const empelado_1 = __importDefault(require("../routes/empelado"));
const empresa_1 = __importDefault(require("../routes/empresa"));
const departamentos_1 = __importDefault(require("../routes/departamentos"));
const asistencias_1 = __importDefault(require("../routes/asistencias"));
const horarios_1 = __importDefault(require("../routes/horarios"));
const vacaciones_1 = __importDefault(require("../routes/vacaciones"));
const auth_1 = __importDefault(require("../routes/auth"));
const sync_1 = __importDefault(require("../routes/sync"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.connectToMongoDB();
    }
    connectToMongoDB() {
        const mongoUri = 'mongodb+srv://jaimeson1305:Deusexvolta1305@cluster0.rew7wcv.mongodb.net/?retryWrites=true&w=majority';
        mongoose_1.default.connect(process.env.mongoUri)
            .then(() => console.log('Conexión a MongoDB establecida'))
            .catch((err) => console.error(err));
    }
    routes() {
        this.app.use('/api/auth', auth_1.default);
        this.app.use('/api/usuarios', usuario_1.default);
        this.app.use('/api/empleados', empelado_1.default);
        this.app.use('/api/empresas', empresa_1.default);
        this.app.use('/api/departamentos', departamentos_1.default);
        this.app.use('/api/asistencias', asistencias_1.default);
        this.app.use('/api/horarios', horarios_1.default);
        this.app.use('/api/vacaciones', vacaciones_1.default);
        this.app.use('/api/sync', sync_1.default);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    }
}
exports.default = new Server();
