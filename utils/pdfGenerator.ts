import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const generateProjectPDF = async (data: {
  title: string;
  date: string;
  author: string;
  description: string;
  images: string[];
}) => {
  const imageTags = data.images
    .map((uri) => `<img src="${uri}" style="width:45%; margin:5px;" />`)
    .join('');

  const html = `
    <html>
      <body style="font-family: Arial; padding: 20px;">
        <h1>${data.title}</h1>
        <p><b>วันที่:</b> ${data.date}</p>
        <p><b>ผู้จัดทำ:</b> ${data.author}</p>
        <hr/>
        <div>${data.description}</div>
        <hr/>
        <div style="display:flex; flex-wrap:wrap;">
          ${imageTags}
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri);
  }

  return uri;
};
