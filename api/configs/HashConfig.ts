import { 
    HASH_ALGORITHM,
    HASH_LENGTH,
    ENCRYPTION_ALGORITHM,
    IV_LENGTH,
    SALT_LENGTH,
    SALT_SECRET
} from "../constants/ENVParameters";
import handleConfig, { ConfigObjectI } from "./configHandler";

const hashConfigObject: ConfigObjectI[] = [
    { name: "hashAlgorithm", key: HASH_ALGORITHM },
    { name: "hashLength", key: HASH_LENGTH },
    { name: "encryptionAlgorithm", key: ENCRYPTION_ALGORITHM },
    { name: "ivLength", key: IV_LENGTH },
    { name: "saltLength", key: SALT_LENGTH }, 
    { name: "saltSecret", key: SALT_SECRET }
]

const HASH_CONFIG = handleConfig(hashConfigObject);

export default HASH_CONFIG;