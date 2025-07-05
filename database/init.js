const fs = require('fs');

const FOLDER_LIST = ["types","tables", "functions"];
const INIT_PATH = "init.sql";

fs.writeFileSync(INIT_PATH, '');

FOLDER_LIST.forEach(folder => {
    const folderPath = `${__dirname}/${folder}`;
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
        const filePath = `${folderPath}/${file}`;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        fs.appendFileSync(INIT_PATH, fileContent.concat("\n\n\n"));
    });
});