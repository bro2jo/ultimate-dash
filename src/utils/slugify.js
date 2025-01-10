// src/utils/slugify.js
import slugify from 'slugify';

export const createAthleteSlug = (name) => {
  return slugify(name, {
    lower: true,       // Convert to lowercase
    strict: true,      // Remove special characters
    remove: /[*+~.()'"!:@]/g, // Additional character removal if needed
  });
};
