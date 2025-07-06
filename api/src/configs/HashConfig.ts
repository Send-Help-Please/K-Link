import { 
    HASH_ALGORITHM,
    HASH_LENGTH,
    ENCRYPTION_ALGORITHM,
    IV_LENGTH,
    SALT_LENGTH,
    SALT_SECRET
} from "../constants/ENVParameters";
import handleConfig from "./configHandler";

const hashConfigList = [HASH_ALGORITHM, HASH_LENGTH, ENCRYPTION_ALGORITHM, IV_LENGTH, SALT_LENGTH, SALT_SECRET] as const;

const HASH_CONFIG = handleConfig(hashConfigList);

export default HASH_CONFIG;