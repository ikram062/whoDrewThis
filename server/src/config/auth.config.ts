// import { betterAuth } from "better-auth"
// import { prismaAdapter } from "better-auth/adapters/prisma"
// import prisma from "@/db/prisma"

// export const auth = betterAuth({
//     database: prismaAdapter(prisma, {
//         provider: "mongodb",
//     }),

//     emailAndPassword: {
//         enabled: true,
//         requireEmailVerification: false,
//     },

//     session: {
//         expiresIn: 60 * 60 * 24,
//     },
// })