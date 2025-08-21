import app from "./app";
import { appConfig } from "./config";

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
