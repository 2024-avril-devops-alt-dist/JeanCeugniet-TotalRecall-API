import { genSaltSync as genSalt, hashSync as hash, compareSync as pwdCompare } from "bcrypt-ts";

async function hashPassword() {
    console.log("hashPassword >>")
    const unHashedPassword = "AFuser1Pass";
    const salt1 = genSalt(10);
    let hashedPassword1 = hash(unHashedPassword, salt1);
    hashedPassword1 = '$2a$10$6msqbZjXlrmgNvx1Trzk/.eXLCpeFDmQCBoo3SwvgFXt9ylF8TA.2';
    console.log(`hashed password 1 : ${hashedPassword1}`);
    const salt2 = genSalt(10);
    let hashedPassword2 = hash(unHashedPassword, salt2);
    hashedPassword2 = '$2a$10$rqAWRs6tT0IvQsOErDCOpeTj1VIRH0idsggfa6zHiv05nD2rbgzQO';
    console.log(`hashed password 2 : ${hashedPassword2}`);
    let comparison = pwdCompare(unHashedPassword, hashedPassword1);
    console.log(`Comparison 1 : ${comparison}`)
    comparison = pwdCompare(unHashedPassword, hashedPassword2);
    console.log(`Comparison 2 : ${comparison}`)
    let hashedPassword2Modif = '$2a$10$rqAWRs6tT0IvQsOErDCOpeTj1VIRH0idsggfa6zHiv05nD2rbgZQO'
    comparison = pwdCompare(unHashedPassword, hashedPassword2Modif);
    console.log(`Comparison 2 : ${comparison}`)

    console.log("<< hashPassword")
}

hashPassword().then(async () => {
    console.log("ok")
    })
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    });
