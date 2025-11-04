import 'dotenv/config';

export default {
  expo: {
    name: "uom-course-finder",
    slug: "uom-course-finder",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
