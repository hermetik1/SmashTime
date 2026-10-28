import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import SftpClient from "ssh2-sftp-client";

const args = process.argv.slice(2);
const sourceFlagIndex = args.indexOf("--source");
const sourceArg = sourceFlagIndex >= 0 ? args[sourceFlagIndex + 1] : "out";

if (!sourceArg || sourceArg.startsWith("--")) {
  throw new Error("Bitte einen gültigen Upload-Ordner mit --source angeben.");
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const sourcePath = path.resolve(projectRoot, sourceArg);
const localConfigPath = path.join(projectRoot, "ionos-deploy.local.json");
const localConfig = await fs
  .readFile(localConfigPath, "utf8")
  .then((file) => JSON.parse(file))
  .catch((error) => {
    if (error.code === "ENOENT") return {};
    throw new Error(`Ungültige lokale IONOS-Konfiguration: ${error.message}`);
  });

const sftpHost = process.env.SMASHTIME_SFTP_HOST || localConfig.host;
const sftpUser = process.env.SMASHTIME_SFTP_USER || localConfig.username;
const sftpPort = Number(process.env.SMASHTIME_SFTP_PORT || localConfig.port || 22);
const remotePath = process.env.SMASHTIME_SFTP_REMOTE_PATH || localConfig.remotePath;
const password = process.env.SMASHTIME_SFTP_PASSWORD;
const keyPath = process.env.SMASHTIME_SFTP_KEY || localConfig.privateKeyPath;

if (!sftpHost || !sftpUser || !remotePath) {
  throw new Error(
    "Bitte SMASHTIME_SFTP_HOST, SMASHTIME_SFTP_USER und SMASHTIME_SFTP_REMOTE_PATH setzen."
  );
}

if (!password && !keyPath) {
  throw new Error(
    "Bitte SMASHTIME_SFTP_PASSWORD setzen oder einen lokalen SMASHTIME_SFTP_KEY angeben."
  );
}

const sourceStats = await fs.stat(sourcePath).catch(() => null);
if (!sourceStats?.isDirectory()) {
  throw new Error(`Upload-Quelle nicht gefunden: ${sourcePath}`);
}

const config = {
  host: sftpHost,
  port: sftpPort,
  username: sftpUser,
};

if (password) {
  config.password = password;
}

if (keyPath) {
  config.privateKey = await fs.readFile(path.resolve(keyPath));
}

const sftp = new SftpClient();
let uploadedFiles = 0;

async function uploadDirectory(localDirectory, remoteDirectory) {
  await sftp.mkdir(remoteDirectory, true).catch(() => undefined);
  const entries = await fs.readdir(localDirectory, { withFileTypes: true });
  entries.sort((a,b)=>{
    if(a.name===".htaccess")return 1;
    if(b.name===".htaccess")return -1;
    if(a.isDirectory()!==b.isDirectory())return a.isDirectory()?-1:1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    const localEntry = path.join(localDirectory, entry.name);
    const remoteEntry = `${remoteDirectory.replace(/\/$/, "")}/${entry.name}`;

    if (entry.isDirectory()) {
      await uploadDirectory(localEntry, remoteEntry);
      continue;
    }

    if (entry.isFile()) {
      const temporaryEntry = `${remoteEntry}.uploading`;
      await sftp.fastPut(localEntry, temporaryEntry);
      await sftp.posixRename(temporaryEntry, remoteEntry);
      uploadedFiles += 1;
    }
  }
}

try {
  console.log(`Verbinde mit ${sftpUser}@${sftpHost}:${sftpPort} ...`);
  await sftp.connect(config);
  await uploadDirectory(sourcePath, remotePath);
  console.log(`SFTP-Upload erfolgreich: ${uploadedFiles} Dateien.`);
} finally {
  await sftp.end().catch(() => undefined);
}
