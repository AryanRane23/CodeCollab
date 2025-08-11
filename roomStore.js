// roomsStore.js
const rooms = {
    'e379ea9d-45bf-4dc6-a022-aaea10165d00':{language:'javascript'},
    '98cc1c42-5339-4ac6-b8c2-20f7d3c9251f':{language:'cpp'},
    'd84841ec-b7a4-40f4-8db0-781b54a87716':{language:'javascript'},
    'e37a8bd9-7dea-4e9c-91e8-a4c01ccc0f30':{language:'javascript'},
};

export function addRoom(roomId, language) {
  rooms[roomId] = { language };
}

export function getRoom(roomId) {
  return rooms[roomId];
}
