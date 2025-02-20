import { Request, Response, NextFunction } from "express";
import FormData from "form-data";
import dotenv from "dotenv";
import { Readable } from "stream";
import axios from "axios";
dotenv.config();

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const axiosInstance = axios.create({
  baseURL: `${process.env.UPLOAD_CUSTOM}/instant_page/api/v1/file/upload/`,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
  },
  withCredentials: true, // Allow cookies for this request
});

const streamUpload = async (base64: string, id = null, retries = 0) => {
  const MAX_RETRIES = 99; // Maximum number of retries
  if (retries >= MAX_RETRIES) {
    console.error("Maximum retries exceeded");
    return "";
  }

  const TOKEN = "TndEPk5RVdyKGBePRBRQMcL9iam0UPrf";
  const form = createFormData(base64);

  try {
    const response = await axiosInstance.post("/", form, {
      headers: {
        ...form.getHeaders(),
        Cookie: `csrftoken=${TOKEN};`,
        "x-csrftoken": `${TOKEN}`,
      },
    });

    if (response?.data?.code === 100006) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      return streamUpload(base64, retries + 1); // Retry the request
    }

    if (response?.data?.message === "success") {
      const link =
        response?.data.data?.src
          .split(`${process.env.BASE_IMAGE_URL}/`)[1]
          ?.split(".image")[0] || "";

      return link;
    } else {
      return "";
    }
  } catch (error) {
    console.error(error);
    return streamUpload(base64, retries + 1);
  }
};

const streamUploadEdit = async (base64: string, id = null, retries = 0) => {
  const MAX_RETRIES = 99; // Maximum number of retries
  if (retries >= MAX_RETRIES) {
    console.error("Maximum retries exceeded");
    return "";
  }

  const TOKEN = "TndEPk5RVdyKGBePRBRQMcL9iam0UPrf";
  const form = createFormData(base64);

  try {
    const response = await axiosInstance.post("/", form, {
      headers: {
        ...form.getHeaders(),
        Cookie: `csrftoken=${TOKEN};`,
        "x-csrftoken": `${TOKEN}`,
      },
    });

    if (response?.data?.code === 100006) {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      return streamUploadEdit(base64, id, retries + 1); // Retry the request
    }

    if (response?.data?.message === "success") {
      const link =
        response?.data.data?.src
          .split(`${process.env.BASE_IMAGE_URL}/`)[1]
          ?.split(".image")[0] || "";
      let objectNew = {};
      if (id) {
        objectNew["id"] = id;
      }
      objectNew["link"] = link;

      return objectNew;
    } else {
      return "";
    }
  } catch (error) {
    console.error(error);
    return streamUploadEdit(base64, id, retries + 1);
  }
};

const createFormData = (base64: string) => {
  const form = new FormData();
  const matches = base64.match(/^data:image\/(\w+);base64,/);
  const format = matches ? matches[1] : "png"; // Default to 'png' if format cannot be determined
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const dataBuffer: Buffer = Buffer.from(base64Data, "base64");

  form.append("file", bufferToStream(dataBuffer), `image.${format}`);
  form.append("name", `GNOUD-${new Date().getTime()}.png`);

  return form;
};


export const upload_single_base64 = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body.image) {
        req.body.image = await streamUpload(req.body.image);
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

