export const extractPublicId = (url) => {
  const parts = url.split("/upload/")[1]; // e.g. "v123456/users/abc/photo.jpg"
  const [versionAndPath] = parts.split("."); // remove extension
  const publicId = versionAndPath
    .split("/")
    .slice(1) // remove version (e.g., "v123456")
    .join("/");

  return publicId; // => "users/abc/photo"
};
