if (process.env.NODE_ENV === "dev") {
    require("dotenv").config();
}

const handleConfig = <T extends readonly string[]>(keys: T): { [K in T[number]]: string } => {
    const values = {} as { [K in T[number]]: string };

    keys.forEach((key) => {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Config value ${key} not found. Please add it to the .env file`);
        }

        values[key as T[number]] = value;
    });

    return values;
};

export default handleConfig;