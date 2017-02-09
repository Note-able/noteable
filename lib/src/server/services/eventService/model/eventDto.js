"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var eventMapper = exports.eventMapper = function eventMapper(event, user) {
  return {
    id: event.id,
    location: {
      latitude: event.latitude,
      longitude: event.longitude
    },
    description: event.notes,
    startDateTime: event.start_date,
    endDateTime: event.end_date,
    name: event.name,
    imageUrl: event.image_url,
    user: user
  };
};