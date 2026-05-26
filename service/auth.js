const { v4: uuidv4 } = require("uuid");

const sessionIdToUserMap = new Map();

function setUser(user) {
    const sessionId = uuidv4(); 
    sessionIdToUserMap.set(sessionId, user);
    return sessionId;
}

function getUser(id) {
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser,
};