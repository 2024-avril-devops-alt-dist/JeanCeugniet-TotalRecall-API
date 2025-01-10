import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { genSaltSync as genSalt, hashSync as pwdHash, compareSync as pwdTest } from "bcrypt-ts";

function randomInt(a: number, b: number): number {
    return Math.floor(Math.random() * (b - a)) + a;
}

// Fonction pour générer un siège crédible (numéro + lettre entre A et H)
const generateSeat = () => {
    const row = randomInt(1, 31); // Numéro de siège entre 1 et 30
    const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'][randomInt(0, 8)]; // Lettre de siège entre A et H
    return `${row}${letter}`;
};

// Fonction pour générer une réservation
async function createBookings() {
    // On suppose que nous avons déjà des buyers, passengers, et des vols créés
    const buyers = await prisma.buyer.findMany(); // Récupérer les buyers existants
    buyers.forEach(buyer => {
        console.log(`buyer : ${buyer.buyerId}`)
    });
    const passengers = await prisma.passenger.findMany(); // Récupérer les passagers existants
    passengers.forEach(passenger => {
        console.log(`passenger : ${passenger.passengerId}`)
        
    });
    const flights = await prisma.flight.findMany({ where: { flightCanBeBooked: true } }); // Filtrer les vols réservables
    flights.forEach(flight => {
        console.log(`flight : ${flight.flightId}`)
        
    });

    // On va générer 10 réservations aléatoires
    for (let i = 0; i < 10; i++) {
        const buyer = buyers[randomInt(0, buyers.length)]; // Sélectionner un buyer aléatoire
        const passenger = passengers[randomInt(0, passengers.length)]; // Sélectionner un passenger aléatoire
        const flight = flights[randomInt(0, flights.length)]; // Sélectionner un vol aléatoire réservé
        const seat = generateSeat(); // Générer un siège aléatoire

        // Créer une réservation
        await prisma.booking.create({
            data: {
                bookingBuyerId: buyer.buyerId,
                bookingPassengerId: passenger.passengerId,
                bookingFlightId: flight.flightId,
                bookingSeat: seat,
            },
        });

        console.log(`Réservation ${i + 1} créée :`);
        console.log(`Buyer : ${buyer.buyerClientId}, Passenger : ${passenger.passengerClientId}`);
        console.log(`Flight : ${flight.flightIATACode}, Seat : ${seat}`);
    }
}

async function seed() {
    console.log("seeding")
    return true;
    console.log("vidage >>")
    await prisma.booking.deleteMany()

    await prisma.buyer.deleteMany()
    await prisma.passenger.deleteMany()
    await prisma.client.deleteMany()
    await prisma.user.deleteMany()

    await prisma.stopover.deleteMany()

    await prisma.flight.deleteMany()
    await prisma.company.deleteMany()
    await prisma.companyUser.deleteMany()

    await prisma.airport.deleteMany()
    await prisma.city.deleteMany()
    await prisma.country.deleteMany()
    console.log("<< vidage")
    console.log("remplissage >>")
    console.log("  country >>")
    const countryFrance = await prisma.country.create({
        data: {
            countryName: 'France',
        },
    });
    console.log(`France ID : ${countryFrance.countryId}`)
    const countryAllemagne = await prisma.country.create({
        data: {
            countryName: 'Allemagne',
        },
    });
    console.log(`Allemagne ID : ${countryAllemagne.countryId}`)
    const countryUSA = await prisma.country.create({
        data: {
            countryName: 'USA',
        },
    });
    console.log(`USA ID : ${countryUSA.countryId}`)
    console.log("  << country")
    console.log("  city >>")
    // France
    const cityParis = await prisma.city.create({
        data: {
            cityName: 'Paris',
            cityCountryId: countryFrance.countryId
        },
    });

    const cityLyon = await prisma.city.create({
        data: {
            cityName: 'Lyon',
            cityCountryId: countryFrance.countryId
        },
    });

    const cityNice = await prisma.city.create({
        data: {
            cityName: 'Nice',
            cityCountryId: countryFrance.countryId
        },
    });
    const cityPerpignan = await prisma.city.create({
        data: {
            cityName: 'Perpignan',
            cityCountryId: countryFrance.countryId,
        },
    });

    const cityToulouse = await prisma.city.create({
        data: {
            cityName: 'Toulouse',
            cityCountryId: countryFrance.countryId,
        },
    });

    // Allemagne
    const cityBerlin = await prisma.city.create({
        data: {
            cityName: 'Berlin',
            cityCountryId: countryAllemagne.countryId
        },
    });

    const cityFrankfurt = await prisma.city.create({
        data: {
            cityName: 'Frankfurt am Main',
            cityCountryId: countryAllemagne.countryId
        },
    });

    const cityStuttgart = await prisma.city.create({
        data: {
            cityName: 'Stuttgart',
            cityCountryId: countryAllemagne.countryId
        },
    });
    const cityDusseldorf = await prisma.city.create({
        data: {
            cityName: 'Düsseldorf',
            cityCountryId: countryAllemagne.countryId,
        },
    });
    const cityKoln = await prisma.city.create({
        data: {
            cityName: 'Köln',
            cityCountryId: countryAllemagne.countryId,
        },
    });

    // États-Unis
    const cityNewYork = await prisma.city.create({
        data: {
            cityName: 'New York City',
            cityCountryId: countryUSA.countryId
        },
    });

    const cityChicago = await prisma.city.create({
        data: {
            cityName: 'Chicago',
            cityCountryId: countryUSA.countryId
        },
    });

    const cityDenver = await prisma.city.create({
        data: {
            cityName: 'Denver',
            cityCountryId: countryUSA.countryId
        },
    });
    const cityMiami = await prisma.city.create({
        data: {
            cityName: 'Miami',
            cityCountryId: countryUSA.countryId,
        },
    });
    const citySeattle = await prisma.city.create({
        data: {
            cityName: 'Seattle',
            cityCountryId: countryUSA.countryId,
        },
    });
    console.log("  << city")
    console.log("  airport >>")
    // Aéroports de Paris
    const airportCDG = await prisma.airport.create({
        data: {
            airportName: 'Paris Charles de Gaulle',
            airportIATACode: 'CDG',
            airportCityId: cityParis.cityId,
        },
    });

    const airportORY = await prisma.airport.create({
        data: {
            airportName: 'Paris Orly',
            airportIATACode: 'ORY',
            airportCityId: cityParis.cityId,
        },
    });

    const airportBVA = await prisma.airport.create({
        data: {
            airportName: 'Paris Beauvais',
            airportIATACode: 'BVA',
            airportCityId: cityParis.cityId,
        },
    });

    // Aéroports de Lyon
    const airportLYS = await prisma.airport.create({
        data: {
            airportName: 'Lyon-Saint Exupéry',
            airportIATACode: 'LYS',
            airportCityId: cityLyon.cityId,
        }
    });

    const airportLYN = await prisma.airport.create({
        data: {
            airportName: 'Lyon-Bron',
            airportIATACode: 'LYN',
            airportCityId: cityLyon.cityId,
        },
    });

    // Aéroport de Nice
    const airportNCE = await prisma.airport.create({
        data: {
            airportName: 'Nice Côte d\'Azur',
            airportIATACode: 'NCE',
            airportCityId: cityNice.cityId,
        },
    });

    // Aéroports de Berlin 
    const airportBER = await prisma.airport.create({
        data: {
            airportName: 'Berlin Brandenburg',
            airportIATACode: 'BER',
            airportCityId: cityBerlin.cityId,
        },
    });

    const airportTXL = await prisma.airport.create({
        data: {
            airportName: 'Berlin Tegel',
            airportIATACode: 'TXL',
            airportCityId: cityBerlin.cityId,
        },
    });

    const airportSXF = await prisma.airport.create({
        data: {
            airportName: 'Berlin Schönefeld',
            airportIATACode: 'SXF',
            airportCityId: cityBerlin.cityId,
        },
    });
    // Aéroports de Francfort
    const airportFRA = await prisma.airport.create({
        data: {
            airportName: 'Frankfurt Airport',
            airportIATACode: 'FRA',
            airportCityId: cityFrankfurt.cityId,
        },
    });

    const airportHHN = await prisma.airport.create({
        data: {
            airportName: 'Frankfurt-Hahn',
            airportIATACode: 'HHN',
            airportCityId: cityFrankfurt.cityId,
        },
    });

    // Aéroport de Stuttgart
    const airportSTR = await prisma.airport.create({
        data: {
            airportName: 'Stuttgart Airport',
            airportIATACode: 'STR',
            airportCityId: cityStuttgart.cityId,
        },
    });

    // Aéroports de New York City
    const airportJFK = await prisma.airport.create({
        data: {
            airportName: 'John F. Kennedy International Airport',
            airportIATACode: 'JFK',
            airportCityId: cityNewYork.cityId,
        },
    });

    const airportLGA = await prisma.airport.create({
        data: {
            airportName: 'LaGuardia Airport',
            airportIATACode: 'LGA',
            airportCityId: cityNewYork.cityId,
        },
    });

    const airportEWR = await prisma.airport.create({
        data: {
            airportName: 'Newark Liberty International Airport',
            airportIATACode: 'EWR',
            airportCityId: cityNewYork.cityId,
        },
    });

    // Aéroports de Chicago
    const airportORD = await prisma.airport.create({
        data: {
            airportName: 'O\'Hare International Airport',
            airportIATACode: 'ORD',
            airportCityId: cityChicago.cityId,
        },
    });

    const airportMDW = await prisma.airport.create({
        data: {
            airportName: 'Chicago Midway International Airport',
            airportIATACode: 'MDW',
            airportCityId: cityChicago.cityId,
        },
    });

    // Aéroport de Denver
    const airportDEN = await prisma.airport.create({
        data: {
            airportName: 'Denver International Airport',
            airportIATACode: 'DEN',
            airportCityId: cityDenver.cityId,
        },
    });

    console.log("  << airport")
    console.log("  company >>")
    // Création des compagnies aériennes
    const companyAF = await prisma.company.create({
        data: {
            companyName: 'Air France',
            companyIATACode: 'AF',
        },
    });

    const companyLH = await prisma.company.create({
        data: {
            companyName: 'Lufthansa',
            companyIATACode: 'LH',
        },
    });

    const companyEK = await prisma.company.create({
        data: {
            companyName: 'Emirates',
            companyIATACode: 'EK',
        },
    });

    const companyDL = await prisma.company.create({
        data: {
            companyName: 'Delta Air Lines',
            companyIATACode: 'DL',
        },
    });

    const companyBA = await prisma.company.create({
        data: {
            companyName: 'British Airways',
            companyIATACode: 'BA',
        },
    });
    console.log("  << company")

    console.log("  user >>")

    // Création des utilisateurs pour Air France
    let unhashedPwd1 = "AFuser1Pass";
    let unhashedPwd2 = "AFuser2Pass";
    let salt = genSalt(10);
    const user1PasswordHashAF = await pwdHash(unhashedPwd1, salt);
    salt = genSalt(10);
    const user2PasswordHashAF = await pwdHash(unhashedPwd2, salt);
    if ((!pwdTest(unhashedPwd1, user1PasswordHashAF)) || (!pwdTest(unhashedPwd2, user2PasswordHashAF))) {
        throw new Error('Failed to compare password and hash');
    }
    const user1AF = await prisma.user.create({
        data: {
            userEmail: 'user1@airfrance.com',
            userPasswordHash: user1PasswordHashAF,
            userRole: 'COMPANYUSER',
        },
    });

    const user2AF = await prisma.user.create({
        data: {
            userEmail: 'user2@airfrance.com',
            userPasswordHash: user2PasswordHashAF,
            userRole: 'COMPANYUSER',
        },
    });

    // Création des utilisateurs pour Lufthansa
    unhashedPwd1 = "LHuser1Pass"
    unhashedPwd2 = "LHuser2Pass"
    salt = genSalt(10);
    const user1PasswordHashLH = await pwdHash(unhashedPwd1, salt);
    salt = genSalt(10);
    const user2PasswordHashLH = await pwdHash(unhashedPwd2, salt);
    if ((!pwdTest(unhashedPwd1, user1PasswordHashLH)) || (!pwdTest(unhashedPwd2, user2PasswordHashLH))) {
        throw new Error('Failed to compare password and hash');
    }

    const user1LH = await prisma.user.create({
        data: {
            userEmail: 'user1@lufthansa.com',
            userPasswordHash: user1PasswordHashLH,
            userRole: 'COMPANYUSER',
        },
    });

    const user2LH = await prisma.user.create({
        data: {
            userEmail: 'user2@lufthansa.com',
            userPasswordHash: user2PasswordHashLH,
            userRole: 'COMPANYUSER',
        },
    });

    // Création des utilisateurs pour Emirates
    unhashedPwd1 = "EKuser1Pass"
    unhashedPwd2 = "EKuser2Pass"
    salt = genSalt(10);
    const user1PasswordHashEK = await pwdHash(unhashedPwd1, salt);
    salt = genSalt(10);
    const user2PasswordHashEK = await pwdHash(unhashedPwd2, salt);
    if ((!pwdTest(unhashedPwd1, user1PasswordHashEK)) || (!pwdTest(unhashedPwd2, user2PasswordHashEK))) {
        throw new Error('Failed to compare password and hash');
    }

    const user1EK = await prisma.user.create({
        data: {
            userEmail: 'user1@emirates.com',
            userPasswordHash: user1PasswordHashEK,
            userRole: 'COMPANYUSER',
        },
    });

    const user2EK = await prisma.user.create({
        data: {
            userEmail: 'user2@emirates.com',
            userPasswordHash: user2PasswordHashEK,
            userRole: 'COMPANYUSER',
        },
    });

    // Création des utilisateurs pour Delta Air Lines
    unhashedPwd1 = "DLuser1Pass"
    unhashedPwd2 = "DLuser2Pass"
    salt = genSalt(10);
    const user1PasswordHashDL = await pwdHash(unhashedPwd1, salt);
    salt = genSalt(10);
    const user2PasswordHashDL = await pwdHash(unhashedPwd2, salt);
    if ((!pwdTest(unhashedPwd1, user1PasswordHashDL)) || (!pwdTest(unhashedPwd2, user2PasswordHashDL))) {
        throw new Error('Failed to compare password and hash');
    }

    const user1DL = await prisma.user.create({
        data: {
            userEmail: 'user1@delta.com',
            userPasswordHash: user1PasswordHashDL,
            userRole: 'COMPANYUSER',
        },
    });

    const user2DL = await prisma.user.create({
        data: {
            userEmail: 'user2@delta.com',
            userPasswordHash: user2PasswordHashDL,
            userRole: 'COMPANYUSER',
        },
    });

    // Création des utilisateurs pour British Airways
    unhashedPwd1 = "BAuser1Pass"
    unhashedPwd2 = "BAuser2Pass"
    salt = genSalt(10);
    const user1PasswordHashBA = await pwdHash(unhashedPwd1, salt);
    salt = genSalt(10);
    const user2PasswordHashBA = await pwdHash(unhashedPwd2, salt);
    if ((!pwdTest(unhashedPwd1, user1PasswordHashBA)) || (!pwdTest(unhashedPwd2, user2PasswordHashBA))) {
        throw new Error('Failed to compare password and hash');
    }

    const user1BA = await prisma.user.create({
        data: {
            userEmail: 'user1@britishairways.com',
            userPasswordHash: user1PasswordHashBA,
            userRole: 'COMPANYUSER',
        },
    });

    const user2BA = await prisma.user.create({
        data: {
            userEmail: 'user2@britishairways.com',
            userPasswordHash: user2PasswordHashBA,
            userRole: 'COMPANYUSER',
        },
    });
    // Création des utilisateurs avec le rôle CLIENTUSER
    const user1PasswordHash = await pwdHash("clientJohnDoePass", 10);
    const user2PasswordHash = await pwdHash("clientJaneSmithPass", 10);
    const user3PasswordHash = await pwdHash("clientAliceBrownPass", 10);
    const user4PasswordHash = await pwdHash("clientRobertTaylorPass", 10);
    const user5PasswordHash = await pwdHash("clientEmilyDavisPass", 10);
    const user6PasswordHash = await pwdHash("clientMichaelClarkPass", 10);

    const user1 = await prisma.user.create({
        data: {
            userEmail: 'john.doe@example.com',
            userPasswordHash: user1PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            userEmail: 'jane.smith@example.com',
            userPasswordHash: user2PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            userEmail: 'alice.brown@example.com',
            userPasswordHash: user3PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });
    const user4 = await prisma.user.create({
        data: {
            userEmail: 'robert.taylor@example.com',
            userPasswordHash: user4PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });

    const user5 = await prisma.user.create({
        data: {
            userEmail: 'emily.davis@example.com',
            userPasswordHash: user5PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });

    const user6 = await prisma.user.create({
        data: {
            userEmail: 'michael.clark@example.com',
            userPasswordHash: user6PasswordHash,
            userRole: 'CLIENTUSER',
        },
    });
    console.log("  << user")
    console.log("  companyUser >>")
    // Association des utilisateurs à Air France
    const companyUser1AF = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyAF.companyId,
            companyUserUserId: user1AF.userId,
        },
    });

    const companyUser2AF = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyAF.companyId,
            companyUserUserId: user2AF.userId,
        },
    });

    // Association des utilisateurs à Lufthansa
    const companyUser1LH = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyLH.companyId,
            companyUserUserId: user1LH.userId,
        },
    });

    const companyUser2LH = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyLH.companyId,
            companyUserUserId: user2LH.userId,
        },
    });

    // Association des utilisateurs à Emirates
    const companyUser1EK = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyEK.companyId,
            companyUserUserId: user1EK.userId,
        },
    });

    const companyUser2EK = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyEK.companyId,
            companyUserUserId: user2EK.userId,
        },
    });

    // Association des utilisateurs à Delta Air Lines
    const companyUser1DL = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyDL.companyId,
            companyUserUserId: user1DL.userId,
        },
    });

    const companyUser2DL = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyDL.companyId,
            companyUserUserId: user2DL.userId,
        },
    });

    // Association des utilisateurs à British Airways
    const companyUser1BA = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyBA.companyId,
            companyUserUserId: user1BA.userId,
        },
    });

    const companyUser2BA = await prisma.companyUser.create({
        data: {
            companyUserCompanyId: companyBA.companyId,
            companyUserUserId: user2BA.userId,
        },
    });
    console.log("  << companyUser")
    console.log("  >> client")
    // Création des clients
    const client1 = await prisma.client.create({
        data: {
            clientUserId: user1.userId, // Remplacez `user1` par un utilisateur existant avec un rôle CLIENTUSER
            clientFirstname: 'John',
            clientLastname: 'Doe',
            clientAddress: '123 Main Street',
            clientCityId: cityNewYork.cityId, // Associez à une ville existante
        },
    });

    const client2 = await prisma.client.create({
        data: {
            clientUserId: user2.userId,
            clientFirstname: 'Jane',
            clientLastname: 'Smith',
            clientAddress: '456 Elm Street',
            clientCityId: cityParis.cityId,
        },
    });

    const client3 = await prisma.client.create({
        data: {
            clientUserId: user3.userId,
            clientFirstname: 'Alice',
            clientLastname: 'Brown',
            clientAddress: '789 Oak Avenue',
            clientCityId: cityBerlin.cityId,
        },
    });

    const client4 = await prisma.client.create({
        data: {
            clientUserId: user4.userId,
            clientFirstname: 'Robert',
            clientLastname: 'Taylor',
            clientAddress: '321 Pine Road',
            clientCityId: cityChicago.cityId,
        },
    });

    const client5 = await prisma.client.create({
        data: {
            clientUserId: user5.userId,
            clientFirstname: 'Emily',
            clientLastname: 'Davis',
            clientAddress: '654 Maple Lane',
            clientCityId: cityNice.cityId,
        },
    });

    const client6 = await prisma.client.create({
        data: {
            clientUserId: user6.userId,
            clientFirstname: 'Michael',
            clientLastname: 'Clark',
            clientAddress: '987 Cedar Street',
            clientCityId: cityFrankfurt.cityId,
        },
    });
    console.log("  << client")
    console.log("  buyer + passenger >>")
    // Sélection aléatoire des clients parmi ceux déjà créés
    const clients = [client1, client2, client3, client4, client5, client6];

    // Affectation des clients en tant que Buyer et/ou Passenger
    const selectedClients = [
        { client: client1, isBuyer: true, isPassenger: true },
        { client: client2, isBuyer: true, isPassenger: true },
        { client: client3, isBuyer: true, isPassenger: true },
        { client: client4, isBuyer: true, isPassenger: false },
        { client: client5, isBuyer: false, isPassenger: true },
        { client: client6, isBuyer: false, isPassenger: false },
    ];

    // Création des entités Buyer et Passenger
    for (const selection of selectedClients) {
        if (selection.isBuyer) {
            await prisma.buyer.create({
                data: {
                    buyerClientId: selection.client.clientId,
                    // buyerTransactionHistory est laissé vide
                },
            });
        }

        if (selection.isPassenger) {
            let passengerDisability = null;
            let passengerSpecifics = null;

            // Assigner un handicap ou une intolérance alimentaire pour certains passagers
            if (selection.client.clientId === client1.clientId) {
                passengerDisability = 'Mobility impairment, requires wheelchair assistance';
            }

            if (selection.client.clientId === client2.clientId) {
                passengerSpecifics = 'Lactose intolerance, requires dairy-free meals';
            }

            await prisma.passenger.create({
                data: {
                    passengerClientId: selection.client.clientId,
                    passengerNationalCountryId: countryUSA.countryId, // Associez à un pays existant
                    passengerDisability: passengerDisability,
                    passengerSpecifics: passengerSpecifics,
                },
            });
        }
    }
    console.log("  << buyer + passenger")
    console.log("  flight + stopover >>")
    // Création de 10 vols
    const flights = await Promise.all([
        // Vol 1 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyAF.companyId,
                flightIATACode: 'AF101',
                flightDepartureAirportId: airportCDG.airportId,
                flightArrivalAirportId: airportJFK.airportId,
                flightProjectedDeparture: new Date('2025-02-01T10:00:00'),
                flightProjectedArrival: new Date('2025-02-01T14:00:00'),
                flightCanBeBooked: true,
            }
        }),

        // Vol 2 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyLH.companyId,
                flightIATACode: 'LH202',
                flightDepartureAirportId: airportFRA.airportId,
                flightArrivalAirportId: airportORD.airportId,
                flightProjectedDeparture: new Date('2025-03-01T11:30:00'),
                flightProjectedArrival: new Date('2025-03-01T16:00:00'),
                flightCanBeBooked: true,
            }
        }),

        // Vol 3 : 1 escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyEK.companyId,
                flightIATACode: 'EK303',
                flightDepartureAirportId: airportDEN.airportId,
                flightArrivalAirportId: airportBER.airportId,
                flightProjectedDeparture: new Date('2025-04-01T12:00:00'),
                flightProjectedArrival: new Date('2025-04-01T18:30:00'),
                flightCanBeBooked: true,
            }
        }).then(flight => {
            // Escale 1 pour Vol 3
            return prisma.stopover.create({
                data: {
                    stopoverFlightId: flight.flightId,
                    stopoverAirportId: airportORY.airportId,
                    stopoverProjectedArrival: new Date('2025-04-01T14:30:00'),
                    stopoverProjectedDeparture: new Date('2025-04-01T15:30:00'),
                    stopoverRank: 1,
                }
            }).then(() => flight);
        }),

        // Vol 4 : 1 escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyDL.companyId,
                flightIATACode: 'DL404',
                flightDepartureAirportId: airportBER.airportId,
                flightArrivalAirportId: airportLGA.airportId,
                flightProjectedDeparture: new Date('2025-05-01T09:00:00'),
                flightProjectedArrival: new Date('2025-05-01T11:30:00'),
                flightCanBeBooked: true,
            }
        }).then(flight => {
            // Escale 1 pour Vol 4
            return prisma.stopover.create({
                data: {
                    stopoverFlightId: flight.flightId,
                    stopoverAirportId: airportNCE.airportId,
                    stopoverProjectedArrival: new Date('2025-05-01T10:00:00'),
                    stopoverProjectedDeparture: new Date('2025-05-01T10:30:00'),
                    stopoverRank: 1,
                }
            }).then(() => flight);
        }),

        // Vol 5 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyAF.companyId,
                flightIATACode: 'AF505',
                flightDepartureAirportId: airportBVA.airportId,
                flightArrivalAirportId: airportEWR.airportId,
                flightProjectedDeparture: new Date('2025-06-01T14:00:00'),
                flightProjectedArrival: new Date('2025-06-01T20:00:00'),
                flightCanBeBooked: true,
            }
        }),

        // Vol 6 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyLH.companyId,
                flightIATACode: 'LH606',
                flightDepartureAirportId: airportMDW.airportId,
                flightArrivalAirportId: airportSTR.airportId,
                flightProjectedDeparture: new Date('2025-07-01T08:30:00'),
                flightProjectedArrival: new Date('2025-07-01T14:00:00'),
                flightCanBeBooked: true,
            }
        }),

        // Vol 7 : 2 escales
        prisma.flight.create({
            data: {
                flightCompanyId: companyEK.companyId,
                flightIATACode: 'EK707',
                flightDepartureAirportId: airportDEN.airportId,
                flightArrivalAirportId: airportBER.airportId,
                flightProjectedDeparture: new Date('2025-08-01T20:00:00'),
                flightProjectedArrival: new Date('2025-08-02T10:30:00'),
                flightCanBeBooked: true,
            }
        }).then(flight => {
            // Escale 1 pour Vol 7
            return prisma.stopover.create({
                data: {
                    stopoverFlightId: flight.flightId,
                    stopoverAirportId: airportLGA.airportId,
                    stopoverProjectedArrival: new Date('2025-08-02T01:00:00'),
                    stopoverProjectedDeparture: new Date('2025-08-02T02:00:00'),
                    stopoverRank: 1,
                }
            }).then(() => {
                // Escale 2 pour Vol 7
                return prisma.stopover.create({
                    data: {
                        stopoverFlightId: flight.flightId,
                        stopoverAirportId: airportLYS.airportId,
                        stopoverProjectedArrival: new Date('2025-08-02T06:30:00'),
                        stopoverProjectedDeparture: new Date('2025-08-02T07:00:00'),
                        stopoverRank: 2,
                    }
                }).then(() => flight);
            });
        }),

        // Vol 8 : 2 escales
        prisma.flight.create({
            data: {
                flightCompanyId: companyDL.companyId,
                flightIATACode: 'DL808',
                flightDepartureAirportId: airportCDG.airportId,
                flightArrivalAirportId: airportNCE.airportId,
                flightProjectedDeparture: new Date('2025-09-01T07:00:00'),
                flightProjectedArrival: new Date('2025-09-01T16:00:00'),
                flightCanBeBooked: true,
            }
        }).then(flight => {
            // Escale 1 pour Vol 8
            return prisma.stopover.create({
                data: {
                    stopoverFlightId: flight.flightId,
                    stopoverAirportId: airportTXL.airportId,
                    stopoverProjectedArrival: new Date('2025-09-01T10:30:00'),
                    stopoverProjectedDeparture: new Date('2025-09-01T11:00:00'),
                    stopoverRank: 1,
                }
            }).then(() => {
                // Escale 2 pour Vol 8
                return prisma.stopover.create({
                    data: {
                        stopoverFlightId: flight.flightId,
                        stopoverAirportId: airportEWR.airportId,
                        stopoverProjectedArrival: new Date('2025-09-01T14:00:00'),
                        stopoverProjectedDeparture: new Date('2025-09-01T14:30:00'),
                        stopoverRank: 2,
                    }
                }).then(() => flight);
            });
        }),

        // Vol 9 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyAF.companyId,
                flightIATACode: 'AF909',
                flightDepartureAirportId: airportORY.airportId,
                flightArrivalAirportId: airportBER.airportId,
                flightProjectedDeparture: new Date('2025-10-01T12:00:00'),
                flightProjectedArrival: new Date('2025-10-01T15:30:00'),
                flightCanBeBooked: true,
            }
        }),

        // Vol 10 : Sans escale
        prisma.flight.create({
            data: {
                flightCompanyId: companyLH.companyId,
                flightIATACode: 'LH100',
                flightDepartureAirportId: airportNCE.airportId,
                flightArrivalAirportId: airportBVA.airportId,
                flightProjectedDeparture: new Date('2025-11-01T10:30:00'),
                flightProjectedArrival: new Date('2025-11-01T13:30:00'),
                flightCanBeBooked: true,
            }
        })
    ]);
    console.log("  << flight + stopover")
    console.log("<< remplissage")


    console.log("finito")


}

seed().then(async () => {
    await createBookings();
    await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
