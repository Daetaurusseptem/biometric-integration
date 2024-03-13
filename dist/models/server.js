"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const usuario_js_1 = __importDefault(require("../routes/usuario.js"));
const empelado_js_1 = __importDefault(require("../routes/empelado.js"));
const empresa_js_1 = __importDefault(require("../routes/empresa.js"));
const departamentos_js_1 = __importDefault(require("../routes/departamentos.js"));
const asistencias_js_1 = __importDefault(require("../routes/asistencias.js"));
const horarios_js_1 = __importDefault(require("../routes/horarios.js"));
const vacaciones_js_1 = __importDefault(require("../routes/vacaciones.js"));
const auth_js_1 = __importDefault(require("../routes/auth.js"));
const sync_js_1 = __importDefault(require("../routes/sync.js"));
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
        mongoose_1.default.connect(process.env.mongoUri)
            .then(() => console.log('Conexión a MongoDB establecida'))
            .catch((err) => console.error(err));
    }
    routes() {
        this.app.use('/api/auth', auth_js_1.default);
        this.app.use('/api/usuarios', usuario_js_1.default);
        this.app.use('/api/empleados', empelado_js_1.default);
        this.app.use('/api/empresas', empresa_js_1.default);
        this.app.use('/api/departamentos', departamentos_js_1.default);
        this.app.use('/api/asistencias', asistencias_js_1.default);
        this.app.use('/api/horarios', horarios_js_1.default);
        this.app.use('/api/vacaciones', vacaciones_js_1.default);
        this.app.use('/api/sync', sync_js_1.default);
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto ${port}`);
        });
    }
}
exports.default = new Server();
