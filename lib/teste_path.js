console.log('Arquivo de teste na raiz');
const fs = require('fs');
try {
  const files = fs.readdirSync('.');
  console.log('Conteúdo da raiz:', files);
  const libFiles = fs.readdirSync('./lib');
  console.log('Conteúdo da pasta lib:', libFiles);
} catch (err) {
  console.error('Erro ao ler diretórios:', err);
}
