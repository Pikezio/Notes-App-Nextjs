import PDF from "pdf-parse";

export function parsePDF(file) {
  PDF(file).then((data) => {
    console.log(data.info);
  });
}
