import prisma from "./utils/prisma.js";

console.log("Start");

try {
  console.log("Before");

  const user = await prisma.user.findUnique({
    where: {
      email: "email_yang_ada_di_database@example.com",
    },
  });

  console.log("After");
  console.log(user);
} catch (err) {
  console.error(err);
} finally {
  await prisma.$disconnect();
}
