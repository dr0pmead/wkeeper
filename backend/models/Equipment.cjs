const mongoose = require('mongoose')

// Описание схемы дисков
const DiskSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Size: { type: Number, required: true },
    FreeSpace: { type: Number, required: true }
});

// Описание схемы компонентов (процессор, память и видеокарта)
const ComponentSchema = new mongoose.Schema({
    Type: { type: String },
    Name: { type: String },
    Manufacturer: { type: String },
    Quantity: { type: Number },
    Data: { type: String }
});

// Описание схемы принтера
const PrinterSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    PortName: { type: String, required: true },
    Default: { type: Boolean, default: false },
    IpAddress: { type: String }
});

const IpAddressSchema = new mongoose.Schema({
    main: { type: String, required: true },
    secondary: [{ type: String }]
});

// Описание основной схемы для equipment
const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ipAddress: { type: IpAddressSchema, required: true },
    components: [ComponentSchema],
    disks: [DiskSchema],
    anyDesk: { type: String },
    teamViewer: { type: String },
    printer: PrinterSchema,
    online: { type: Boolean, default: true },
    owner: { type: String, required: true },
    department: { type: String, required: true },
    division: { type: String },
    lastUpdated: { type: Date, default: Date.now },
    osVersion: { type: String },
    inventoryNumber: { type: String, default: 'Неизвестен' },
    estimation: { type: Number },
    qrcode: { type: String },
    type: { type: String }
});

module.exports = mongoose.model('Equipment', EquipmentSchema);
