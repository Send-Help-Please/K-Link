if(process.env.NODE_ENV === "dev"){
    require("dotenv").config();
}

export interface HandleConfigReturnI {
    [key: string]: string
}

export interface ConfigObjectI {
    name: string,
    key: string
}

const handleConfig = (configObjects: ConfigObjectI[]): HandleConfigReturnI => {
    const values: HandleConfigReturnI = {};
     
    configObjects.forEach(configObject => {
        let value: string | undefined = process.env[configObject.key];
        
        if(!value) {
            throw new Error(`Config value ${configObject.key} not found. Please add it to the .env file`);
        }

        values[configObject.name] = value as string;
    });

    return values;
}

export default handleConfig;