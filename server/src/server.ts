import app from "./app"
import chalk from "chalk";

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(
    chalk.yellow.bold(`\n🚀 Server is running on port ${PORT}`),
    chalk.magenta(`\n➡️  Local:   http://localhost:${PORT}`),
  );
});
