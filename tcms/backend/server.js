require('dotenv').config();
const app  = require('./src/app');
const env  = require('./src/config/env');

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   TCMS — Tax Case Management System      ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`\n🚀  Server running on http://localhost:${PORT}`);
  console.log(`📋  Environment : ${env.NODE_ENV}`);
  console.log(`\n📧  Demo Login Credentials:`);
  console.log(`    Admin  →  admin@tcms.gov.in   / admin123`);
  console.log(`    EDCOM  →  edcom@tcms.gov.in   / edcom123`);
  console.log(`    STO-1  →  sto1@tcms.gov.in    / sto123`);
  console.log(`    STO-2  →  sto2@tcms.gov.in    / sto123`);
  console.log(`\n✅  Ready.\n`);
});