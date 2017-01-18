'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var userMapper = exports.userMapper = function userMapper(dbUser) {
  return {
    avatarUrl: dbUser.avatar_url,
    coverImage: dbUser.cover_url,
    id: dbUser.id,
    email: dbUser.email,
    location: dbUser.location,
    name: dbUser.name,
    bio: dbUser.bio,
    preferences: {
      instruments: dbUser.instruments.split(',')
    }
  };
};