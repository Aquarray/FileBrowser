//Todo : Add icons to all files ::ALMOST DONE
//Todo: Make look better :DONE
//Todo : Add Ip hosting way : DONE
//Todo: Add Assets auto creation
//Todo: Add config support :DONE
//Todo : Add http support
//Todo: Empty Folder Error :DONE

let config = {
  folder: "./",
  useDynu: false,
  dynuUrl: "",
  dynuPassword: "",
  onlyLocal: false,
  port: 3000,
};

//imports
const http2 = require("http2");
const fs = require("fs");
const { exec } = require("child_process");
const { Transform } = require("stream");
const os = require('os');

const http2server = http2.createSecureServer({
  key: fs.readFileSync("./Assets/key.pem"),
  cert: fs.readFileSync("./Assets/cert.pem"),
});

const platform = os.platform();

const Show_Dir = (stream, url, json_str) => {
  let result_form = "";
  if (json_str != "") {
    for (const path_data of json_str) {
      if (path_data.isDir) {
        result_form += `
        <a href="${url}${encodeURI(path_data.name)}">
            <div class="Item Folder">
                <div class="img_container"><img src="/?icon=folder"/></div>
                <div style="width: 100%;display: flex;flex-direction: column;">
                    <p1 class="FileName">${path_data.name}</p1>
                    <div class="Info">
                        <p1 class="Fileext">Folder</p1>
                    </div>
                </div>
        </div>
        </a>`;
      } else {
        const icn = getIconName(path_data.type);
        result_form += `
        <a href="${url}${encodeURI(path_data.name)}">
            <div class="Item File">
                <div class="img_container"><img src="?icon=${icn}"/></div>
                <div style="width: 100%;display: flex;flex-direction: column;">
                    <p1 class="FileName">${path_data.name}</p1>
                    <div class="Info">
                        <p1 class="Fileext">${
                          icn.charAt(0).toUpperCase() +
                          icn.replace("_", " ").slice(1)
                        }</p1>
                        <p1 class="FileSize">${path_data.size}</p1>
                    </div>
                </div>
        </div>
        </a>`;
      }
    }
  } else {
    result_form = "<h1>Empty Folder......</h1>";
  }
  fs.createReadStream("./Assets/indexoffline.html")
    .pipe(
      new Transform({
        transform(chunk, encoding, callback) {
          const replaced = chunk.toString().replace("{}", result_form);
          callback(null, replaced);
        },
      })
    )
    .pipe(stream);
};

const getMIMEtype = (extension) => {
  switch (extension) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/x-wav";
    case "gif":
      return "image/gif";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "svg":
      return "image/svg+xml";
    case "txt":
      return "text/plain";
    case "css":
      return "text/css";
    case "json":
      return "text/json";
    case "html":
      return "text/html";
    case "js":
      return "text/javascript";
    case "xml":
      return "text/xml";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "webm":
      return "video/webm";
    case "mkv":
      return "video/matroska";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "exe":
      return "application/vnd.microsoft.portable-executable";
    case "pdf":
      return "application/pdf";
    case "doc":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "zip":
      return "application/zip";
    case "rar":
      return "application/x-rar-compressed";
    case "7z":
      return "application/x-7z-compressed";
    case "tar":
      return "application/x-tar";
    case "gz":
      return "application/gzip";
    case "bz2":
      return "application/x-bzip2";
    case "ico":
      return "image/vnd.microsoft.icon";
    case "cur":
      return "image/vnd.microsoft.icon";
    case "tiff":
      return "image/tiff";
    case "tif":
      return "image/tiff";
    case "bmp":
      return "image/bmp";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    case "ttf":
      return "font/ttf";
    case "eot":
      return "application/vnd.ms-fontobject";
    case "apk":
      return "application/vnd.android.package-archive";
    default:
      return "";
  }
};

const getIconName = (extension) => {
  // MD new icon
  //Conf file
  //Unkown Files
  if (["pem", "cer"].includes(extension)) {
    return "certificate";
  } else if (extension === "json") {
    return "json";
  } else if (extension === "js") {
    return "js";
  } else if (extension === "html") {
    return "html";
  } else if (extension === "rs") {
    return "rust";
  } else if (extension === "py") {
    return "python";
  } else if (["zip", "7z", "rar", "gz", "tar"].includes(extension)) {
    return "archive";
  } else if (["mp4", "mov", "mkv", "avi", "webm"].includes(extension)) {
    return "video";
  } else if (extension === "pdf") {
    return "pdf";
  } else if (["exe", "msi"].includes(extension)) {
    return "windows_apps";
  } else if (
    ["png", "jpeg", "jpg", "svg", "webp", "jfif", "heif", "exr"].includes(
      extension
    )
  ) {
    return "Image";
  } else if (["txt", "csv", "md"].includes(extension)) {
    return "text";
  } else if (["mp3", "flac", "wav"].includes(extension)) {
    return "music";
  } else if (["conf", "ini", "bat", "cmd", "ps1"].includes(extension)) {
    return "settings";
  } else {
    return "unknown";
  }
};

const generateConfig = () => {
  const configContent = `folder=${config.folder}
useDynu=${config.useDynu}
dynuUrl=${config.dynuUrl}
dynuPassword=${config.dynuPassword}
onlyLocal=${config.onlyLocal}
port=${config.port}
`;
  fs.writeFileSync(
    config.folder + "/FBrowser.config",
    configContent.trim()
  );
  console.log(`Config file generated at ${config.folder}/FBrowser.config`);
};

const readConfig = (path) => {
  try {
    const configContent = fs.readFileSync(path, "utf-8");
    const lines = configContent.split("\n");

    for (const line of lines) {
      if (!line || line.startsWith("#")) continue; // Skip empty lines or comments
      const [key, value] = line.split("=").map((s) => s.trim());

      if (key in config) {
        if (key === "port") {
          config[key] = parseInt(value, 10);
        } else if (key === "useDynu" || key === "onlyLocal") {
          config[key] = value === "true";
        } else {
          config[key] = value;
        }
      }
    }
    console.log(`Successfully loaded config from ${path}`);
  } catch (error) {
    console.error(`Error reading config file at ${path}:`, error.message);
    process.exit(1);
  }
};

http2server.on("stream", (stream, headers) => {
  if (headers[":method"] == "GET") {
    //Favicon
    if (headers[":path"].endsWith("/favicon.ico")) {
      fs.createReadStream("./Assets/favicon.png").pipe(stream);
      return;
    }

    // Fonts
    if (headers[":path"] == "/ce17a53c-b77c-4f6b-8364-8e1f89209254") {
      stream.respond({ ":status": 200, "content-type": "font/ttf" });
      fs.createReadStream("./Assets/Font/font-bold.ttf").pipe(stream);
      return;
    }

    //Assets

    if (headers[":path"].includes("?icon=")) {
      if (
        fs.existsSync(`./Assets/Icons/${headers[":path"].split("=")[1]}.svg`)
      ) {
        stream.respond({ ":status": 200, "content-type": "image/svg+xml" });
        fs.createReadStream(
          "./Assets/Icons/" + headers[":path"].split("=")[1] + ".svg"
        ).pipe(stream);
      } else {
        console.log(
          "Asset Not Found : ./Assets/Icons/" +
            headers[":path"].split("=")[1] +
            ".svg"
        );
        stream.respond({ ":status": 404 });
        stream.end();
      }
      return;
    }

    // For Content
    let absolute_path = config.folder + decodeURI(headers[":path"]);
    exec(`./Assets/${platform=="win32"? "read_dir.exe" : "read_dir"} \"${absolute_path}\"`, (err, stout, stderr) => {
      if (err && platform!="win32") {
        exec("chmod +x ./Assets/read_dir", (e, o, se) => {});
        console.log("ERROR: Assets Problem : " + err);
        return;
      }
      if (stderr) console.log("ERROR:" + stderr);
      else {
        if (stout == "[]") {
          const contentlength = fs.statSync(absolute_path).size;
          if (headers.range) {
            // For Partial Content
            const extremums = headers.range.split("=")[1].split("-");
            stream.respond({
              ":status": 206,
              "content-type": getMIMEtype(absolute_path.split(".").pop()),
              "content-length":
                extremums[1] != ""
                  ? Number(extremums[1]) - Number(extremums[0]) + 1
                  : contentlength - Number(extremums[0]),
              "Accept-Ranges": "bytes",
              "Content-Range": `bytes ${extremums[0]}-${
                extremums[1] != "" ? extremums[1] : contentlength - 1
              }`,
            });
            fs.createReadStream(absolute_path, {
              start: parseInt(extremums[0], 10),
              end:
                extremums[1] != "" ? Number(extremums[1]) : contentlength - 1,
              highWaterMark: 64 * 1024,
            }).pipe(stream);
          } else {
            //Full Content
            stream.respond({
              ":status": 200,
              "content-type": getMIMEtype(absolute_path.split(".").pop()),
              "content-length": contentlength,
              "Accept-Ranges": "bytes",
            });
            fs.createReadStream(absolute_path, {
              highWaterMark: 64 * 1024,
            }).pipe(stream);
          }
        } else if (stout == "NoPath") {
          // Error page : TODO
          console.log("File not found : " + decodeURI(headers[":path"]));
          stream.respond({ ":status": 404 });
          stream.end();
        } else if (stout == "") {
          return;
        } else {
          // For Directory
          stream.respond({ ":status": 200, "content-type": "text/html" });
          Show_Dir(
            stream,
            headers[":path"].endsWith("/")
              ? headers[":path"]
              : headers[":path"] + "/",
            stout != "]" ? JSON.parse(stout) : ""
          );
        }
      }
    });
  }
});

const args = process.argv.slice(2);

const configPathIndex = args.indexOf("-c");
if (configPathIndex !== -1 && args[configPathIndex + 1]) {
  readConfig(args[configPathIndex + 1]);
}

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  const nextArg = args[i + 1];

  switch (arg) {
    case "-d":
    case "-dynu":
      config.useDynu = true;
      break;
    case "-l":
    case "-local":
      config.onlyLocal = true;
      break;
    case "-durl":
      if (nextArg) {
        config.dynuUrl = nextArg;
        i++; // Skip next argument
      }
      break;
    case "-dpwd":
      if (nextArg) {
        config.dynuPassword = nextArg;
        i++; // Skip next argument
      }
      break;
    case "-f":
      if (nextArg) {
        config.folder = nextArg;
        i++;
      } else {
        console.log('Kindly specify the folder path after -f.');
      }
      break;
    case "-p":
      if (nextArg) {
        config.port = parseInt(nextArg, 10);
        i++;
      }
      break;
    case "-generate":
      generateConfig();
      process.exit(0);
      break;
    case "--help":
      console.log(`
  -d, -dynu      : To update IP on Dynu service.
  -l, -local     : To host on local address only.
  -durl <URL>    : Your Dynu hostname (default: ${config.dynuUrl}).
  -dpwd <PASS>   : Your Dynu password hash. (Recommended: use environment variable DYNU_PASSWORD).
  -f <PATH>      : Path to the folder to host.
  -p <PORT>      : The port to host on (default: 3000).
  -c <PATH>      : Use a predefined config file.
  -generate      : Generate a config file in the target folder.
  --help         : Show this help message.
      `);
      process.exit(0);
      break;
  }
}
const host = config.onlyLocal ? '::1' : '::';

http2server.listen(config.port, host, () => {
  console.log(`Server listening on host ${host}, port ${config.port}`);
});

const envPassword = process.env.DYNU_PASSWORD;
if (envPassword) {
  config.dynuPassword = envPassword;
}

if (config.useDynu) {
  if (!config.dynuPassword) {
    console.error("ERROR: Dynu is enabled (-d) but no password was provided.");
    console.error("Set it with the -dpwd flag or the DYNU_PASSWORD environment variable.");
    process.exit(1);
  }
  const url = `http://api-ipv6.dynu.com/nic/update?hostname=${config.dynuUrl}&password=${config.dynuPassword}`;
  http.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log(`✅ Listening via Dynu: https://${config.dynuUrl}:${config.port}`);
    } else {
      console.error(`❌ ERROR: Couldn't update Dynu. StatusCode: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error("❌ ERROR: Failed to connect to Dynu service:", err.message);
  });
} else if (config.onlyLocal) {
  console.log(`✅ Hosted on Localhost: https://127.0.0.1:${config.port} or https://[::1]:${config.port}`);
} else {
  console.log(`✅ Hosted on all interfaces: https://0.0.0.0:${config.port} or https://[::]:${config.port}`);
}
if (config.folder.endsWith("/"))config.folder =config.folder.substring(0,config.folder.length - 1);
