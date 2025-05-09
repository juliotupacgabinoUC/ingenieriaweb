const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/productosRoutes'));
app.use('/api', require('./routes/categoriasRoutes'));
app.use('/api', require('./routes/clientesRoutes'));
app.use('/api', require('./routes/ventasRoutes'));
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
