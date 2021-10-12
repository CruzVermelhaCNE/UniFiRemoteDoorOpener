function validationNone(authorizationArguments, payload) {
    return true;
}

function validationUserIds(authorizationArguments, payload) {
    return authorizationArguments.includes(payload.from.id);
}

module.exports = {
    "none":validationNone,
    "user_ids":validationUserIds
}