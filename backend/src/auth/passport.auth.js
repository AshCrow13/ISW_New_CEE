"use strict";
import passport from "passport";
import Estudiante from "../entity/estudiante.entity.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js";
import { AppDataSource } from "../config/configDb.js";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const estudianteRepository = AppDataSource.getRepository(Estudiante);
      const estudiante = await estudianteRepository.findOne({
        where: {
          email: jwt_payload.email,
        },
      });

      if (estudiante) {
        return done(null, estudiante);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }),
);

export function passportJwtSetup() {
  passport.initialize();
}
