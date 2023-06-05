const neo4j = require('neo4j-driver');

const driverNeo4J = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'password')
);

module.exports = driverNeo4J