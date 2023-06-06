const neo4j = require('neo4j-driver')

const {
    URI,
    DB_USERNAME,
    PASSWORD,
    DATABASE
} = process.env

const driverNeo4J = neo4j.driver(
    URI, neo4j.auth.basic(DB_USERNAME, PASSWORD)
)

const sessionNeo4J = driverNeo4J.session({ DATABASE })

module.exports = sessionNeo4J    